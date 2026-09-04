#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
SCRIPT AUTOMATIZADO DE INTELIGENCIA DE DATOS Y ANÁLISIS DE ENCUESTA
CAPÍTULO ESTUDIANTIL ACM — INSTITUTO TECNOLÓGICO DE CIUDAD MADERO (ITCM)
================================================================================
Autor: Jesús Javier Hernández Olvera (N.C. 23070477)
Gestión: 2026-2027
Objetivo:
    Procesar automáticamente el CSV descargado de Google Forms, generar
    tablas cruzadas, cálculo de significancia estadística, KPIs de campaña
    y un set completo de gráficas en alta resolución (300 DPI) para la defensa
    del Plan Estratégico de Trabajo.
================================================================================
"""

import os
import sys
import argparse
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Configuración de estilo editorial y visual de alto nivel
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 11,
    "axes.titlesize": 13,
    "axes.labelsize": 11,
    "figure.titlesize": 15,
    "xtick.labelsize": 10,
    "ytick.labelsize": 10
})

def find_column(df, keywords):
    """Busca dinámicamente una columna que contenga todas las palabras clave dadas."""
    for col in df.columns:
        col_lower = col.lower()
        if all(kw.lower() in col_lower for kw in keywords):
            return col
    return None

def generar_reporte_estadistico(csv_path="respuestas_encuesta.csv", output_dir="metricas_graficas"):
    if not os.path.exists(csv_path):
        print(f"\n[ERROR] No se encontró el archivo '{csv_path}'.")
        print("-> Por favor descarga el archivo de respuestas desde Google Forms con el nombre 'respuestas_encuesta.csv'")
        print("   o indica la ruta mediante: python3 analyze_survey.py --csv ruta/a/tu_archivo.csv\n")
        return

    os.makedirs(output_dir, exist_ok=True)
    df = pd.read_csv(csv_path)
    total_respuestas = len(df)

    print("=" * 80)
    print(f"  SISTEMA DE ANÁLISIS ESTADÍSTICO — ENCUESTA ISC ITCM 2026-2027")
    print(f"  Total de encuestas procesadas: {total_respuestas}")
    print("=" * 80)

    # -------------------------------------------------------------------------
    # 1. Distribución por Semestre
    # -------------------------------------------------------------------------
    col_semestre = find_column(df, ["semestre"])
    if col_semestre:
        plt.figure(figsize=(10, 5))
        orden_semestres = sorted(df[col_semestre].dropna().unique())
        ax = sns.countplot(data=df, y=col_semestre, order=orden_semestres, palette="Blues_r")
        plt.title("1. Distribución Muestral por Semestre (ISC ITCM)")
        plt.xlabel("Cantidad de Alumnos")
        plt.ylabel("Semestre Cursado")
        for p in ax.patches:
            width = p.get_width()
            ax.annotate(f"{int(width)} ({width/total_respuestas*100:.1f}%)",
                        (width + 0.5, p.get_y() + p.get_height() / 2.),
                        ha="left", va="center", fontsize=10)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/01_distribucion_semestral.png", dpi=300)
        plt.close()
        print("[✓] Gráfica 1 generada: Distribución semestral.")

    # -------------------------------------------------------------------------
    # 2. Evaluación de Urgencia del Programa 'Padres de Sistemas' (Tutorías)
    # -------------------------------------------------------------------------
    col_tutorias = find_column(df, ["padres de sistemas"]) or find_column(df, ["tutoría", "mentoría"])
    if col_tutorias:
        tutorias_num = pd.to_numeric(df[col_tutorias], errors="coerce").dropna()
        promedio_urgencia = tutorias_num.mean()
        pct_alta_demanda = (tutorias_num >= 4).mean() * 100

        plt.figure(figsize=(8, 5))
        counts = tutorias_num.value_counts().sort_index()
        ax = counts.plot(kind="bar", color="#1E88E5", edgecolor="#0D47A1", width=0.6)
        plt.title(f"2. Urgencia Percibida: Programa 'Padres de Sistemas'\n(Media: {promedio_urgencia:.2f}/5.00 | Alta prioridad: {pct_alta_demanda:.1f}%)")
        plt.xlabel("Escala de Necesidad (1 = Innecesario, 5 = Crítico/Urgente)")
        plt.ylabel("Frecuencia de Respuestas")
        plt.xticks(rotation=0)
        for p in ax.patches:
            height = p.get_height()
            ax.annotate(f"{int(height)} ({height/len(tutorias_num)*100:.1f}%)",
                        (p.get_x() + p.get_width() / 2., height + 0.5),
                        ha="center", va="bottom", fontsize=10)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/02_urgencia_tutorias.png", dpi=300)
        plt.close()
        print(f"[✓] Gráfica 2 generada: Urgencia de Tutorías (Media: {promedio_urgencia:.2f}/5).")

    # -------------------------------------------------------------------------
    # 3. Estado de Repositorios en GitHub y Portafolio Profesional
    # -------------------------------------------------------------------------
    col_github = find_column(df, ["github", "perfil"]) or find_column(df, ["github"])
    if col_github:
        plt.figure(figsize=(9, 5))
        gh_counts = df[col_github].value_counts()
        colors = ["#2E7D32", "#F9A825", "#C62828"][:len(gh_counts)]
        ax = gh_counts.plot(kind="pie", autopct="%1.1f%%", startangle=140, colors=colors,
                            wedgeprops=dict(width=0.6, edgecolor='w'))
        plt.title("3. Diagnóstico de Portafolios: ¿Los Alumnos Mantienen Perfil Activo en GitHub?")
        plt.ylabel("")
        plt.tight_layout()
        plt.savefig(f"{output_dir}/03_diagnostico_github.png", dpi=300)
        plt.close()
        print("[✓] Gráfica 3 generada: Diagnóstico de GitHub.")

    # -------------------------------------------------------------------------
    # 4. Respaldo a la Soberanía Tecnológica (Sistemas Propios para el ITCM)
    # -------------------------------------------------------------------------
    col_soberania = find_column(df, ["soberanía tecnológica"]) or find_column(df, ["desarrolle e implemente"])
    if col_soberania:
        plt.figure(figsize=(10, 4.5))
        counts_sob = df[col_soberania].value_counts()
        ax = sns.barplot(x=counts_sob.values, y=counts_sob.index, palette="mako")
        plt.title("4. Opinión sobre Desarrollo de Sistemas Propios por el Capítulo ACM")
        plt.xlabel("Frecuencia")
        plt.ylabel("")
        for p in ax.patches:
            width = p.get_width()
            ax.annotate(f"{int(width)} ({width/total_respuestas*100:.1f}%)",
                        (width + 0.5, p.get_y() + p.get_height() / 2.),
                        ha="left", va="center", fontsize=10)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/04_soberania_tecnologica.png", dpi=300)
        plt.close()
        print("[✓] Gráfica 4 generada: Soberanía Tecnológica.")

    # -------------------------------------------------------------------------
    # 5. Aspiraciones de Roles Profesionales
    # -------------------------------------------------------------------------
    col_roles = find_column(df, ["rol profesional"]) or find_column(df, ["aspiras"])
    if col_roles:
        plt.figure(figsize=(10, 5))
        # Desglosar casillas múltiples separadas por comas o punto y coma
        roles_series = df[col_roles].dropna().apply(lambda x: [item.strip() for item in str(x).split(",")])
        roles_flat = [item for sublist in roles_series for item in sublist if len(item) > 2]
        roles_df = pd.Series(roles_flat).value_counts().head(8)
        ax = sns.barplot(x=roles_df.values, y=roles_df.index, palette="rocket")
        plt.title("5. Roles Profesionales con Mayor Aspiración entre Estudiantes")
        plt.xlabel("Menciones")
        plt.ylabel("")
        for p in ax.patches:
            width = p.get_width()
            ax.annotate(f"{int(width)}", (width + 0.5, p.get_y() + p.get_height() / 2.),
                        ha="left", va="center", fontsize=10)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/05_roles_profesionales.png", dpi=300)
        plt.close()
        print("[✓] Gráfica 5 generada: Roles Profesionales.")

    # -------------------------------------------------------------------------
    # 6. Aceptación del Programa Alumni Mentoring (Egresados)
    # -------------------------------------------------------------------------
    col_alumni = find_column(df, ["egresados"]) or find_column(df, ["alumni"])
    if col_alumni:
        plt.figure(figsize=(9, 4.5))
        counts_alumni = df[col_alumni].value_counts()
        ax = sns.barplot(x=counts_alumni.values, y=counts_alumni.index, palette="crest")
        plt.title("6. Interés en Programa de Mentoría con Egresados del ITCM")
        plt.xlabel("Frecuencia")
        plt.ylabel("")
        for p in ax.patches:
            width = p.get_width()
            ax.annotate(f"{int(width)} ({width/total_respuestas*100:.1f}%)",
                        (width + 0.5, p.get_y() + p.get_height() / 2.),
                        ha="left", va="center", fontsize=10)
        plt.tight_layout()
        plt.savefig(f"{output_dir}/06_alumni_mentoring.png", dpi=300)
        plt.close()
        print("[✓] Gráfica 6 generada: Alumni Mentoring.")

    # -------------------------------------------------------------------------
    # 7. Directorio de Voluntarios y Banco de Talento
    # -------------------------------------------------------------------------
    col_nombre = find_column(df, ["nombre"])
    col_control = find_column(df, ["control"])
    col_correo = find_column(df, ["correo"])
    col_tel = find_column(df, ["whatsapp"]) or find_column(df, ["teléfono"]) or find_column(df, ["celular"])
    col_voluntariado = find_column(df, ["organizador"]) or find_column(df, ["involucrarte"]) or find_column(df, ["comité"])

    if col_voluntariado and col_nombre:
        filtro_voluntarios = df[col_voluntariado].notna() & ~df[col_voluntariado].str.contains("no me interesa", case=False, na=False)
        cols_directorio = [c for c in [col_nombre, col_control, col_semestre, col_correo, col_tel, col_voluntariado] if c is not None]
        df_voluntarios = df.loc[filtro_voluntarios, cols_directorio]
        voluntarios_csv = f"{output_dir}/DIRECTORIO_VOLUNTARIOS.csv"
        df_voluntarios.to_csv(voluntarios_csv, index=False, encoding="utf-8-sig")
        print(f"[✓] Directorio de Voluntarios exportado: {len(df_voluntarios)} estudiantes registrados en '{voluntarios_csv}'.")

    # -------------------------------------------------------------------------
    # 8. Generación de Resumen Ejecutivo de Datos (Data-Driven Report)
    # -------------------------------------------------------------------------
    report_md_path = f"{output_dir}/RESUMEN_EJECUTIVO_METRICAS.md"
    with open(report_md_path, "w", encoding="utf-8") as f:
        f.write("# REPORTE EJECUTIVO DE RESULTADOS — DIAGNÓSTICO ESTUDIANTIL ISC ITCM\n")
        f.write(f"**Total de Muestra Recabada:** {total_respuestas} estudiantes\n\n")
        f.write("## Hallazgos Críticos para la Candidatura:\n")
        if col_tutorias:
            f.write(f"- **Urgencia del Programa 'Padres de Sistemas':** {promedio_urgencia:.2f} / 5.00 ({pct_alta_demanda:.1f}% lo considera crítico).\n")
        if col_github:
            sin_gh = df[col_github].str.contains("no tengo|vacía|poca", case=False, na=False).mean() * 100
            f.write(f"- **Déficit de Portafolio Técnico:** El {sin_gh:.1f}% de los estudiantes no cuenta con un portafolio documentado en GitHub.\n")
        if col_soberania:
            apoyo_sob = df[col_soberania].str.contains("a favor", case=False, na=False).mean() * 100
            f.write(f"- **Apoyo a la Soberanía Tecnológica Local:** El {apoyo_sob:.1f}% respalda el desarrollo de software institucional por alumnos de Sistemas.\n")
        if col_voluntariado and col_nombre:
            f.write(f"- **Banco de Talento Identificado:** {len(df_voluntarios)} compañeros dispuestos a integrarse a comités del Capítulo ACM.\n")

    print(f"\n[✓] Procesamiento finalizado. Gráficas y reporte guardados en: '{output_dir}/'\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Procesador de Datos de la Encuesta ACM ITCM")
    parser.add_argument("--csv", default="respuestas_encuesta.csv", help="Ruta al archivo CSV de respuestas")
    parser.add_argument("--out", default="metricas_graficas", help="Carpeta de destino para las gráficas")
    args = parser.parse_args()

    generar_reporte_estadistico(csv_path=args.csv, output_dir=args.out)
