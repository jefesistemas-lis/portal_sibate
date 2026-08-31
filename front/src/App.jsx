import { useState, useEffect, useMemo } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import './App.css'
import logoLis from '../img/logo-lis-footer.png'
import seguridadPic1 from '../img/seguridad-img/pic1.png'
import seguridadPic2 from '../img/seguridad-img/pic2.png'
import seguridadPic3 from '../img/seguridad-img/pic3.png'
import { canAccessInformationLevel, getRoleAccessLevel, securityPolicy } from './securityPolicy'

const securitySubmodules = {
  Inicio: {
    icon: '🏠',
    tag: 'Resumen',
    status: 'Activo',
    summary: 'Estado general del módulo de seguridad y avances clave de la organización.',
    items: [
      { title: 'Indicadores clave', description: 'Monitoreo en tiempo real de seguridad, salud y control operativo.', tone: 'good' },
      { title: 'Equipo', description: 'Participación del personal en acciones de prevención y cumplimiento.', tone: 'info' },
      { title: 'Cobertura', description: 'Tareas programadas, seguimiento y cierre de hallazgos.', tone: 'warn' },
    ],
  },
  TEAM: {
    icon: '👥',
    tag: 'Equipo',
    status: 'Actualizado',
    summary: 'Organización de trabajo en equipo, responsabilidades y seguimiento de cumplimiento.',
    gallery: [
      {
        name: 'Brigadistas OPL',
        role: 'Seguridad operativa',
        image: seguridadPic1,
      },
      {
        name: 'Brigadistas OPL',
        role: 'Inspección y control',
        image: seguridadPic2,
      },
      {
        name: 'Capitanes de Almacen',
        role: 'Capacitación y acompañamiento',
        image: seguridadPic3,
      },
    ],
    items: [
    ],
  },
  Inspecciones: {
    icon: '🔎',
    tag: 'Control',
    status: '87%',
    summary: 'Cronograma de inspecciones, verificaciones operativas y hallazgos priorizados.',
    tools: [
      { name: 'Inspección Extintores', description: 'Verificación de carga, acceso, sello y estado general del equipo.', link: 'https://docs.google.com/forms/d/e/1FAIpQLSd2dfOKM5JCInYeIdY01c2Bo0GwIpUqy4fFX28tUbLNfhF25w/viewform?usp=header', weeklyVisits: 3 },
      { name: 'Inspección Botiquín', description: 'Control de medicamentos, materiales y cumplimiento del contenido.', link: 'https://docs.google.com/forms/d/e/1FAIpQLSelO_o9W7mo39A3OjWj1mkgKuTX7rPpa7fXIFSp4erfJcwkwA/viewform?usp=header', weeklyVisits: 2 },
      { name: 'Inspección Camillas', description: 'Revisión de ajuste, limpieza, resistencia y funcionamiento.', link: 'https://docs.google.com/forms/d/e/1FAIpQLScHUKWzVOF0pFDYPFmbikbog_PIZaD8RazdqofqUVcu8tkPqw/viewform?usp=header', weeklyVisits: 2 },
      { name: 'Inspección Gabinete', description: 'Validación del estado del gabinete y elementos de seguridad.', link: 'https://forms.gle/jf2uAEdX6ss3yXim9', weeklyVisits: 1 },
      { name: 'Inspección de carretillas', description: 'Estado del equipo, ruedas, carga y uso seguro.', link: 'https://docs.google.com/forms/d/e/1FAIpQLSddnFIjmfdWpAy1WMJTrAbaVaJviAmzW09Xxco-GVcAJI1ZGg/viewform?usp=header', weeklyVisits: 3 },
      { name: 'Inspección Estibadores', description: 'Control del estado del equipo y procedimientos operativos.', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdHnqJPqearXYUDeNLiNL7wKfhcvy_xC8ZzKYw8ZXFAQPcMKw/viewform?usp=header', weeklyVisits: 2 },
      { name: 'Inspección lava Ojos', description: 'Verificación del sistema de lavado ocular y abastecimiento.', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdl7BYG4lgC6SFsM6ms2XR8pvMjmNhGYKeRHEfX2WJ7UOuc5w/viewform?usp=header', weeklyVisits: 1 },
      { name: 'Inspección de Pistola de Calor', description: 'Inspección técnica del equipo de calor y condiciones seguras.', link: 'https://docs.google.com/forms/d/e/1FAIpQLSckOIP6H5y8GukMp67nJUgthRpSaR2hGG7MVXuzfGNbSOBwKw/viewform?usp=header', weeklyVisits: 2 },
    ],
    items: [
    ],
  },
  Capacitaciones: {
    icon: '🎓',
    tag: 'Formación',
    status: '12',
    summary: 'Plan de capacitación, entrenamiento y reforzamiento de competencias.',
    trainingGroups: [
      {
        label: 'AGOSTO',
        items: [
          { name: 'Prevención contra caídas', description: 'Capacitación enfocada en medidas preventivas y uso seguro del trabajo en altura.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUQ0ZJTjAyUjJZQThHTzFBRTdBU1g4NVdZSS4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw0dOAS2umoH3zGlJd4_FHGX', weeklyVisits: 3 },
          { name: 'Safety Champions', description: 'Formación para líderes de seguridad y promoción de buenas prácticas.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.cloud.microsoft%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUQ0ZJTjAyUjJZQThHTzFBRTdBU1g4NVdZSS4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw0dOAS2umoH3zGlJd4_FHGX', weeklyVisits: 2 },
        ],
      },
      {
        label: 'JULIO',
        items: [
          { name: 'Políticas ABI', description: 'Capacitación sobre políticas, estándares y comportamientos seguros.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fr%2FKh0af7FgMf&sa=D&sntz=1&usg=AOvVaw2WVSIyrC4Yh0CQGNED9WK3', weeklyVisits: 2 },
          { name: 'Reporte e Investigación de Accidentes', description: 'Herramientas para reportar, analizar y prevenir incidentes.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUQ0VZTjA2SzU3STM4Uk4xM1dMMUZCWFlRMy4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw3zGHA6', weeklyVisits: 1 },
        ],
      },
      {
        label: 'JUNIO',
        items: [
          { name: 'Sustancias Químicas', description: 'Manejo seguro, etiquetado y controles asociados a químicos.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.cloud.microsoft%2Fr%2Fb6ikRpHx2h%3Forigin%3DlprLink&sa=D&sntz=1&usg=AOvVaw3hd3syQwGLQvA9nu4Tj9Ik', weeklyVisits: 3 },
          { name: 'Seguridad en el Conductor', description: 'Buenas prácticas para conducción defensiva y uso seguro del vehículo.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.cloud.microsoft%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUM09DMkVQNUo4NUtOM0w2Nlg4WkFMM1pSWC4u%26origin%3DlprLink%26route%3Dshorturl&sa=D&sntz=1', weeklyVisits: 2 },
        ],
      },
      {
        label: 'MAYO',
        items: [
          { name: 'Regreso seguro a casa', description: 'Prevención de incidentes en traslados, actividades y rutina de trabajo.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BURDMxQkNLM0tESVNNOTAyVE5OQjhaQ1VPQi4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw19QO11--gDiJxR14H_FMJT', weeklyVisits: 3 },
          { name: 'Checklist preoperacional', description: 'Proceso de revisión previa a la operación y validación de condiciones.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.cloud.microsoft%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUM09DMkVQNUo4NUtOM0w2Nlg4WkFMM1pSWC4u%26origin%3DlprLink%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw0dOAS2umoH3zGlJd4_FHGX', weeklyVisits: 2 },
        ],
      },
      {
        label: 'PRIMER SEMESTRE',
        items: [
          { name: 'Capacitación flota', description: 'Lineamientos de seguridad operativa y cuidado del equipo móvil.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUMTBURVpYMzZPQkk4NTVIQU9IUTFYUE1ISS4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw2vvVIGj4wL8eHV3M38M_Ue', weeklyVisits: 1 },
          { name: 'Regreso seguro: a casa y al trabajo', description: 'Buenas prácticas para la seguridad en desplazamiento y rutina laboral.', link: 'https://forms.gle/c4QoQBPitEWEfp2U8', weeklyVisits: 2 },
          { name: 'SAM y LOTO', description: 'Metodologías de bloqueo y control de energía para trabajos seguros.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fr%2FKh0af7FgMf&sa=D&sntz=1&usg=AOvVaw2WVSIyrC4Yh0CQGNED9WK3', weeklyVisits: 2 },
        ],
      },
    ],
    trainings: [
      { name: 'Prevención contra caídas', description: 'Capacitación enfocada en medidas preventivas y uso seguro del trabajo en altura.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUQ0ZJTjAyUjJZQThHTzFBRTdBU1g4NVdZSS4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw0dOAS2umoH3zGlJd4_FHGX', weeklyVisits: 3 },
      { name: 'Safety Champions', description: 'Formación para líderes de seguridad y promoción de buenas prácticas.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.cloud.microsoft%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUQ0ZJTjAyUjJZQThHTzFBRTdBU1g4NVdZSS4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw0dOAS2umoH3zGlJd4_FHGX', weeklyVisits: 2 },
      { name: 'Políticas ABI', description: 'Capacitación sobre políticas, estándares y comportamientos seguros.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fr%2FKh0af7FgMf&sa=D&sntz=1&usg=AOvVaw2WVSIyrC4Yh0CQGNED9WK3', weeklyVisits: 2 },
      { name: 'Reporte e Investigación de Accidentes', description: 'Herramientas para reportar, analizar y prevenir incidentes.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUQ0VZTjA2SzU3STM4Uk4xM1dMMUZCWFlRMy4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw3zGHA6', weeklyVisits: 1 },
      { name: 'Sustancias Químicas', description: 'Manejo seguro, etiquetado y controles asociados a químicos.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.cloud.microsoft%2Fr%2Fb6ikRpHx2h%3Forigin%3DlprLink&sa=D&sntz=1&usg=AOvVaw3hd3syQwGLQvA9nu4Tj9Ik', weeklyVisits: 3 },
      { name: 'Seguridad en el Conductor', description: 'Buenas prácticas para conducción defensiva y uso seguro del vehículo.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.cloud.microsoft%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUM09DMkVQNUo4NUtOM0w2Nlg4WkFMM1pSWC4u%26origin%3DlprLink%26route%3Dshorturl&sa=D&sntz=1', weeklyVisits: 2 },
      { name: 'Regreso seguro a casa', description: 'Prevención de incidentes en traslados, actividades y rutina de trabajo.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BURDMxQkNLM0tESVNNOTAyVE5OQjhaQ1VPQi4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw19QO11--gDiJxR14H_FMJT', weeklyVisits: 3 },
      { name: 'Checklist preoperacional', description: 'Proceso de revisión previa a la operación y validación de condiciones.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.cloud.microsoft%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUM09DMkVQNUo4NUtOM0w2Nlg4WkFMM1pSWC4u%26origin%3DlprLink%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw0dOAS2umoH3zGlJd4_FHGX', weeklyVisits: 2 },
      { name: 'Capacitación flota', description: 'Lineamientos de seguridad operativa y cuidado del equipo móvil.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fpages%2Fresponsepage.aspx%3Fid%3DGUvwznZ3lEq4mzdcd6j5NgEueaPCi4JJpoSb1dgI80BUMTBURVpYMzZPQkk4NTVIQU9IUTFYUE1ISS4u%26origin%3DQRCode%26route%3Dshorturl&sa=D&sntz=1&usg=AOvVaw2vvVIGj4wL8eHV3M38M_Ue', weeklyVisits: 1 },
      { name: 'Regreso seguro: a casa y al trabajo', description: 'Buenas prácticas para la seguridad en desplazamiento y rutina laboral.', link: 'https://forms.gle/c4QoQBPitEWEfp2U8', weeklyVisits: 2 },
      { name: 'SAM y LOTO', description: 'Metodologías de bloqueo y control de energía para trabajos seguros.', link: 'https://www.google.com/url?q=https%3A%2F%2Fforms.office.com%2Fr%2FKh0af7FgMf&sa=D&sntz=1&usg=AOvVaw2WVSIyrC4Yh0CQGNED9WK3', weeklyVisits: 2 },
    ],
  },
  ACIs: {
    icon: '📌',
    tag: 'Gestión',
    status: 'Revisión',
    summary: 'Acciones correctivas, preventivas e indicadores del rendimiento operacional con clasificación de sensibilidad y control de acceso.',
    policyNote: 'La información pública se mantiene visible; la técnica, operativa y sensible queda protegida con controles de acceso y redacción.',
    securityControls: [
      'Clasificación por sensibilidad: pública, interna, confidencial y restringida.',
      'Redacción automática para datos técnicos y no autorizados.',
      'Restricción de acceso según rol, nivel y necesidad de conocer.',
      'Registro de trazabilidad para cumplimiento de la política de seguridad de la información.',
    ],
    items: [

    ],
  },
  Preoperacionales: {
    icon: '🧰',
    tag: 'Operación',
    status: 'OK',
    summary: 'Verificación previa a la operación para garantizar continuidad segura y detectar condiciones de riesgo antes del trabajo.',
    tools: [
      { name: 'Preoperacional Estibadores', description: 'Checklist de revisión previa para estibadores y condiciones de operación segura.', link: 'https://forms.gle/9CXjrHbVUTsHZTQJ8', weeklyVisits: 3 },
      { name: 'Preoperacional Carretillas', description: 'Validación del estado de las carretillas, ruedas, frenos y carga segura.', link: 'https://forms.gle/z88KcCuZv1ySvE476', weeklyVisits: 3 },
      { name: 'Preoperacional Pistola de Calor', description: 'Inspección técnica, accesorios, encendido y condiciones seguras de uso.', link: 'https://forms.gle/ktXzKeN9dc5iqssY9', weeklyVisits: 2 },
      { name: 'Preoperacional Bisturi de Seguridad', description: 'Verificación de estado, limpieza y uso correcto del equipo de corte seguro.', link: 'https://forms.gle/6mV1j6e7YoFtmNwE8', weeklyVisits: 2 },
      { name: 'Escaleras Marketplace', description: 'Revisión de escalas, estabilidad, acceso y condiciones antes de uso.', link: 'https://docs.google.com/forms/d/e/1FAIpQLSe8FMeEGoY0hXCra50lNAY4HuyXnVDiIYvHa17GvHa17GvSt0k8vgCw/viewform?usp=header', weeklyVisits: 2 },
      { name: 'Preoperacional Carros MKP', description: 'Revisión de operación, estabilidad y condiciones seguras del carro MKP.', link: 'https://forms.gle/y87LNXS1ebAvX7867', weeklyVisits: 2 },
    ],
  },
  'NOTI OL': {
    icon: '📣',
    tag: 'Comunicaciones',
    status: 'Vigente',
    summary: 'Canal de seguridad y OL con cápsulas tipo noticiero, recomendaciones prácticas y contenidos de sensibilización para el personal.',
    tools: [
      {
        name: 'Uso de EPPS',
        description: 'Segmento informativo sobre el uso correcto, cuidado y cumplimiento de los elementos de protección personal.',
        link: 'https://drive.google.com/file/d/1eeys76JdD10AuprV9uRlr_ckP2OmckX1/view?usp=sharing',
        embedUrl: 'https://drive.google.com/file/d/1eeys76JdD10AuprV9uRlr_ckP2OmckX1/preview',
        weeklyVisits: 3,
      },
      {
        name: '360° de Montacargas',
        description: 'Video de sensibilización sobre la operación segura de montacargas y la revisión del entorno antes de avanzar.',
        link: 'https://drive.google.com/file/d/1lRFQAPReDgEEFWly21qnMi8PJ2tOfIvk/view?usp=sharing',
        embedUrl: 'https://drive.google.com/file/d/1lRFQAPReDgEEFWly21qnMi8PJ2tOfIvk/preview',
        weeklyVisits: 2,
      },
      {
        name: 'NOTI OL Buenas prácticas',
        description: 'Historias, recomendaciones y mensajes clave para fortalecer la cultura de seguridad en operaciones.',
        link: 'https://drive.google.com/file/d/1v2ufpTEl47qo4-X4Sl6Jk2PXd9cvyLnt/view?usp=sharing',
        embedUrl: 'https://drive.google.com/file/d/1v2ufpTEl47qo4-X4Sl6Jk2PXd9cvyLnt/preview',
        weeklyVisits: 3,
      },
      {
        name: 'Revisión 360°',
        description: 'Cápsula práctica para reforzar observación del entorno, puntos ciegos y condiciones de riesgo.',
        link: 'https://drive.google.com/file/d/1JtadLudOJnSsWtOn56jvrtZrG0_yKRHy/view?usp=sharing',
        embedUrl: 'https://drive.google.com/file/d/1JtadLudOJnSsWtOn56jvrtZrG0_yKRHy/preview',
        weeklyVisits: 2,
      },
      {
        name: 'Control de llaves',
        description: 'Tema de seguridad operacional para manejo responsable de llaves, accesos y control de equipos.',
        link: 'https://drive.google.com/file/d/1EHIQy31iLn6GDjkFE4xEhk1OAQew9YFQ/view?usp=sharing',
        embedUrl: 'https://drive.google.com/file/d/1EHIQy31iLn6GDjkFE4xEhk1OAQew9YFQ/preview',
        weeklyVisits: 2,
      },
    ],
  },
  'Preguntas frecuentes': {
    icon: '❓',
    tag: 'Soporte',
    status: 'Actualizado',
    summary: 'Consulta rápida de dudas frecuentes para líderes, operarios y responsables.',
    items: [
      { title: 'Frecuentes', description: 'Dudas más comunes sobre procedimientos y permisos.', tone: 'info' },
      { title: 'Procedimiento', description: 'Orientación para reportes, permisos y gestión de riesgos.', tone: 'good' },
      { title: 'Contacto', description: 'Canales de atención y coordinación con seguridad.', tone: 'warn' },
    ],
  },
}

const modules = {
  Seguridad: {
    label: 'Seguridad',
    status: 'Más seguros',
    summary:
      'Promover el bienestar y prevenir la fatiga mediante la realización de pausas activas durante la jornada laboral.',
    ctaLabel: 'Pausas Activas',
    ctaLink: 'https://forms.gle/cLoHphWkJS8G1UUn9',
    featureCards: [
      { title: 'Pausas Activas', text: 'Fortaleciendo bienestar y prevención de fatiga.', icon: '⏱️', link: 'https://forms.gle/cLoHphWkJS8G1UUn9' },
      { title: 'Capacitaciones', text: 'Entrenamiento en seguridad, ergonomía y hábitos saludables.', icon: '🎓', link: '#' },
      { title: 'Reporte', text: 'Seguimiento de eventos, observaciones y acciones correctivas.', icon: '📊', link: '#' },
    ],
    kpis: [
      { label: 'Pausas activas', value: '100%', meta: 'Programación vigente' },
      { label: 'Capacitaciones', value: '12', meta: '4 en agenda' },
      { label: 'Reporte de riesgos', value: '08', meta: '2 priorizados' },
      { label: 'Inspecciones', value: '24', meta: 'Sin hallazgos críticos' },
    ],
    highlights: [
      { title: 'Bienestar laboral', detail: 'Se promueve la actividad física y la recuperación durante la jornada.', tone: 'good' },
      { title: 'Prevención de fatiga', detail: 'Se fortalecen pausas activas y monitoreo del esfuerzo físico.', tone: 'warn' },
      { title: 'Control operativo', detail: 'Seguimiento de riesgos, observaciones y acciones inmediatas.', tone: 'good' },
    ],
    listTitle: 'Seguimiento de seguridad',
    list: [
      { item: 'Pausas activas programadas', result: 'OK' },
      { item: 'Capacitación en bienestar', result: 'En curso' },
      { item: 'Inspección de áreas críticas', result: 'OK' },
      { item: 'Reporte de condiciones de trabajo', result: 'Sin novedades' },
    ],
    actions: [
      'Programar las pausas activas por turno y validar participación.',
      'Reforzar la capacitación en prevención de fatiga y ergonomía.',
      'Actualizar el seguimiento de riesgos y observaciones en tiempo real.',
    ],
  },
  Flota: {
    label: 'Flota',
    status: 'Disponibilidad 91%',
    summary:
      'Control de disponibilidad, mantenimientos preventivos y rendimiento de la flota para sostener la operación logística.',
    kpis: [
      { label: 'Disponibilidad', value: '91%', meta: '+2.1% this week' },
      { label: 'Km recorridos', value: '18.4K', meta: 'Optimización de rutas' },
      { label: 'Mantenimientos', value: '14', meta: '5 en proceso' },
      { label: 'Paradas', value: '04', meta: '2 por fallas eléctricas' },
    ],
    highlights: [
      { title: 'Programa de mantenimiento', detail: 'Se cumple 87% del plan preventivo mensual.', tone: 'good' },
      { title: 'Rendimiento por ruta', detail: '3 rutas sobre el promedio de consumo.', tone: 'warn' },
      { title: 'Inventario de repuestos', detail: 'Stock crítico en 2 ítems priorizados.', tone: 'warn' },
    ],
    listTitle: 'Estado de unidades',
    list: [
      { item: 'Ciclo de abastecimiento', result: '9 unidades listas' },
      { item: 'Revisión de frenos', result: '6/8 completadas' },
      { item: 'Cambio de aceite', result: 'En programación' },
      { item: 'Disponibilidad por turno', result: 'Alta' },
    ],
    actions: [
      'Ajustar rutas para reducir consumo de combustible en las unidades críticas.',
      'Solicitar repuestos de filtros y baterías para el almacén.',
      'Validar reparación del conjunto eléctrico en el camión 215.',
    ],
  },
  Calidad: {
    label: 'Calidad',
    status: 'Calidad bajo control',
    summary:
      'Seguimiento de indicadores de servicio, no conformidades y acciones correctivas para mantener la calidad operacional.',
    kpis: [
      { label: 'NCP', value: '4.8%', meta: 'Meta 5%' },
      { label: 'Satisfacción', value: '92%', meta: '+3 pts' },
      { label: 'Reclamos', value: '09', meta: '5 cerrados' },
      { label: 'Mejoras', value: '11', meta: '2 implementadas' },
    ],
    highlights: [
      { title: 'No conformidades', detail: 'Bajo control, sin impacto a clientes principales.', tone: 'good' },
      { title: 'Servicio entregado', detail: 'Se observó 1 desviación en etiquetado.', tone: 'warn' },
      { title: 'Capacitación', detail: 'Taller de calidad ejecutado para 2 equipos.', tone: 'good' },
    ],
    listTitle: 'Indicadores clave',
    list: [
      { item: 'Control de trazabilidad', result: 'CUMPLE' },
      { item: 'Revisión de embalaje', result: 'ALERTA' },
      { item: 'Ajuste de procesos', result: 'En revisión' },
      { item: 'Certificación de calidad', result: 'Vigente' },
    ],
    actions: [
      'Reforzar verificaciones en el punto de etiquetado final.',
      'Cerrar la acción correctiva del embalaje con evidencia documental.',
      'Socializar resultados del taller de calidad con líderes de turno.',
    ],
  },
  Administración: {
    label: 'Administración',
    status: 'Control central',
    summary:
      'Administración de usuarios, permisos, roles y auditoría del portal con trazabilidad de accesos y cambios de seguridad.',
    kpis: [
      { label: 'Usuarios', value: '—', meta: 'Activos y pendientes' },
      { label: 'Roles', value: '5', meta: 'Niveles configurados' },
      { label: 'Logs', value: '—', meta: 'Últimos accesos' },
      { label: 'Estado', value: 'OK', meta: 'Audit vigente' },
    ],
    highlights: [
      { title: 'Seguridad por roles', detail: 'Cada acceso está validado en backend según permisos.', tone: 'good' },
      { title: 'Bitácora', detail: 'Se registran inicios de sesión, salidas y cambios.', tone: 'info' },
      { title: 'Control administrativo', detail: 'Puedes activar usuarios o cambiar roles según la política.', tone: 'warn' },
    ],
    listTitle: 'Administración del portal',
    list: [
      { item: 'Control de usuarios', result: 'Activo' },
      { item: 'Permisos por módulo', result: 'Vigente' },
      { item: 'Auditoría', result: 'En línea' },
      { item: 'Roles', result: 'Configurados' },
    ],
    actions: [
      'Revisar usuarios y permisos desde el panel de administración.',
      'Actualizar roles con el mínimo cambio necesario.',
      'Usar la auditoría para validar accesos y cambios críticos.',
    ],
  },
}

function getComplianceStatus(items, minimumPerWeek = 4) {
  if (!Array.isArray(items) || items.length === 0) {
    return { value: '0%', tone: 'critical' }
  }

  const totalWeeklyVisits = items.reduce((sum, item) => {
    const visits = Number(item.weeklyVisits ?? 0)
    return sum + (Number.isFinite(visits) ? visits : 0)
  }, 0)

  const targetVisits = items.length * minimumPerWeek
  const percentage = Math.min(100, Math.round((totalWeeklyVisits / targetVisits) * 100))

  let tone = 'critical'
  if (percentage >= 80) {
    tone = 'good'
  } else if (percentage >= 50) {
    tone = 'warn'
  }

  return { value: `${percentage}%`, tone }
}

function App() {
  const [activeModule, setActiveModule] = useState('Seguridad')
  const [activeSecuritySubmodule, setActiveSecuritySubmodule] = useState('Inicio')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showSecureAciView, setShowSecureAciView] = useState(false)
  const [aciAccessDenied, setAciAccessDenied] = useState(false)
  const [aciIframeBlocked, setAciIframeBlocked] = useState(false)
  const [faqForm, setFaqForm] = useState({
    name: '',
    email: '',
    area: 'Seguridad',
    category: 'Pregunta',
    subject: '',
    message: '',
  })
  const [faqSubmitted, setFaqSubmitted] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(true)
  const [portalAnalytics, setPortalAnalytics] = useState(null)
  const [adminUsers, setAdminUsers] = useState([])
  const [adminAuditLogs, setAdminAuditLogs] = useState([])
  const [adminNotice, setAdminNotice] = useState('')
  const [newUser, setNewUser] = useState({ email: '', name: '', role: 'viewer', status: 'active' })
  const [creatingUser, setCreatingUser] = useState(false)
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const aciVisualUrl = 'https://sites.google.com/lis.com.co/safety-sibate/acis'
  const module = modules[activeModule]
  const activeSecuritySection = securitySubmodules[activeSecuritySubmodule] || securitySubmodules.Inicio
  const trainingItems = activeSecuritySubmodule === 'Capacitaciones' && activeSecuritySection.trainingGroups
    ? activeSecuritySection.trainingGroups.flatMap((group) => group.items)
    : []

  const complianceStatus = activeSecuritySubmodule === 'Inspecciones'
    ? getComplianceStatus(activeSecuritySection.tools)
    : activeSecuritySubmodule === 'Capacitaciones'
      ? getComplianceStatus(trainingItems)
      : { value: activeSecuritySection.status, tone: 'good' }

  const activeRole = authUser?.role || 'viewer'
  const currentUserAccessLevel = getRoleAccessLevel(activeRole)
  const canOpenSecureAciView = canAccessInformationLevel('confidential', activeRole)
  const canAccessAdminPanel = ['superadmin', 'admin'].includes(activeRole)

  const dynamicModuleKpis = useMemo(() => {
    if (!portalAnalytics) {
      return module.kpis
    }

    return [
      {
        label: 'Usuarios activos',
        value: `${portalAnalytics.summary.activeUsers}`,
        meta: 'usuarios habilitados',
      },
      {
        label: 'Accesos hoy',
        value: `${portalAnalytics.summary.todayLogins}`,
        meta: 'sesiones autenticadas',
      },
      {
        label: 'Error rate',
        value: `${portalAnalytics.summary.errorRate}%`,
        meta: 'errores del sistema',
      },
      {
        label: 'Rendimiento',
        value: `${portalAnalytics.summary.performanceScore}%`,
        meta: 'score general',
      },
    ]
  }, [module.kpis, portalAnalytics])

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          setAuthUser(null)
          return
        }

        const data = await response.json()
        setAuthUser(data.user)
      } catch (error) {
        setAuthUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    restoreSession()
  }, [apiBaseUrl])

  useEffect(() => {
    if (activeModule === 'Administración') {
      setActiveSecuritySubmodule('Inicio')
    }

    if (activeModule !== 'Seguridad') {
      return
    }

    if (!securitySubmodules[activeSecuritySubmodule]) {
      setActiveSecuritySubmodule('Inicio')
    }
  }, [activeModule, activeSecuritySubmodule])

  useEffect(() => {
    if (!authUser || !canAccessAdminPanel) {
      setAdminUsers([])
      setAdminAuditLogs([])
      setPortalAnalytics(null)
      return
    }

    const loadAdminData = async () => {
      try {
        const [usersResponse, auditResponse, analyticsResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/api/admin/users`, { credentials: 'include' }),
          fetch(`${apiBaseUrl}/api/admin/audit`, { credentials: 'include' }),
          fetch(`${apiBaseUrl}/api/admin/analytics`, { credentials: 'include' }),
        ])

        if (!usersResponse.ok || !auditResponse.ok || !analyticsResponse.ok) {
          throw new Error('No se pudo cargar la administración')
        }

        const usersData = await usersResponse.json()
        const auditData = await auditResponse.json()
        const analyticsData = await analyticsResponse.json()
        setAdminUsers(usersData.users || [])
        setAdminAuditLogs(auditData.audit_logs || [])
        setPortalAnalytics(analyticsData.analytics || null)
        setAdminNotice('')
      } catch (error) {
        setPortalAnalytics(null)
        setAdminNotice('No se pudo cargar la información de administración.')
      }
    }

    loadAdminData()
  }, [authUser, apiBaseUrl, canAccessAdminPanel])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const syncSecureAciView = () => {
      setShowSecureAciView(window.location.hash === '#aci-visual')
    }

    syncSecureAciView()
    window.addEventListener('hashchange', syncSecureAciView)

    return () => window.removeEventListener('hashchange', syncSecureAciView)
  }, [])

  const openSecureAciView = () => {
    if (!canOpenSecureAciView) {
      setAciAccessDenied(true)
      return
    }

    setAciAccessDenied(false)
    setAciIframeBlocked(false)
    setShowSecureAciView(false)

    if (typeof window !== 'undefined') {
      window.open(aciVisualUrl, '_blank', 'noopener,noreferrer')
      window.history.pushState(null, '', window.location.pathname + window.location.search)
    }
  }

  const closeSecureAciView = () => {
    setShowSecureAciView(false)
    setAciAccessDenied(false)
    setAciIframeBlocked(false)
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.pathname + window.location.search)
    }
  }

  const handleFaqSubmit = (event) => {
    event.preventDefault()

    if (!faqForm.name.trim() || !faqForm.email.trim() || !faqForm.subject.trim() || !faqForm.message.trim()) {
      setFaqSubmitted(false)
      return
    }

    setFaqSubmitted(true)
    setFaqForm({
      name: '',
      email: '',
      area: 'Seguridad',
      category: 'Pregunta',
      subject: '',
      message: '',
    })
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const credential = credentialResponse?.credential

    if (!credential) {
      setAuthError('No se recibió la credencial de Google.')
      return
    }

    try {
      setAuthLoading(true)
      const response = await fetch(`${apiBaseUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo autenticar con Google.')
      }

      setAuthUser(data.user)
      setAuthError('')
    } catch (error) {
      setAuthError(error.message || 'Error de autenticación.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleLoginError = () => {
    setAuthError('La autenticación con Google falló.')
  }

  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error cerrando sesión:', error)
    } finally {
      setAuthUser(null)
      setAuthError('')
    }
  }

  const refreshAdminData = async () => {
    if (!canAccessAdminPanel) {
      return
    }

    try {
      const [usersResponse, auditResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/api/admin/users`, { credentials: 'include' }),
        fetch(`${apiBaseUrl}/api/admin/audit`, { credentials: 'include' }),
      ])

      if (!usersResponse.ok || !auditResponse.ok) {
        throw new Error('No se pudo actualizar')
      }

      const usersData = await usersResponse.json()
      const auditData = await auditResponse.json()
      setAdminUsers(usersData.users || [])
      setAdminAuditLogs(auditData.audit_logs || [])
      setAdminNotice('')
    } catch (error) {
      setAdminNotice('No se pudo actualizar la administración.')
    }
  }

  const updateUserRole = async (email, role) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/users/${encodeURIComponent(email)}/role`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error('No se pudo cambiar el rol')
      }

      await refreshAdminData()
      setAdminNotice('Rol actualizado correctamente.')
    } catch (error) {
      setAdminNotice(error.message || 'No se pudo actualizar el rol.')
    }
  }

  const updateUserStatus = async (email, status) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/users/${encodeURIComponent(email)}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado')
      }

      await refreshAdminData()
      setAdminNotice('Estado actualizado correctamente.')
    } catch (error) {
      setAdminNotice(error.message || 'No se pudo actualizar el estado.')
    }
  }

  const createUser = async (event) => {
    event.preventDefault()

    if (!newUser.email.trim()) {
      setAdminNotice('Debes ingresar un correo válido.')
      return
    }

    try {
      setCreatingUser(true)
      const response = await fetch(`${apiBaseUrl}/api/admin/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo crear el usuario.')
      }

      setNewUser({ email: '', name: '', role: 'viewer', status: 'active' })
      await refreshAdminData()
      setAdminNotice('Usuario creado correctamente.')
    } catch (error) {
      setAdminNotice(error.message || 'No se pudo crear el usuario.')
    } finally {
      setCreatingUser(false)
    }
  }

  if (authLoading) {
    return (
      <div className="portal-shell login-shell">
        <div className="login-panel">
          <div className="login-loader">Validando acceso...</div>
        </div>
      </div>
    )
  }

  if (!authUser) {
    return (
      <div className="portal-shell login-shell">
        <div className="login-panel">
          <div className="login-brand">
            <img src={logoLis} alt="Logo LIS" className="brand-logo login-brand-logo" />
            <h1>Portal DPO SIBATE</h1>
          </div>

          <div className="login-card">
            <p className="eyebrow accent">ACCESO AUTORIZADO</p>
            <h2>Ingresar con Google Workspace</h2>
            <p>Solo usuarios con credenciales del dominio <strong>lis.com.co</strong> pueden acceder.</p>

            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
              render={({ onClick, disabled }) => (
                <button
                  type="button"
                  className="google-login-button"
                  onClick={onClick}
                  disabled={disabled}
                >
                  <span className="google-g-mark" aria-hidden="true">G</span>
                  <span>Acceder con Google</span>
                </button>
              )}
            />

            {authError ? <div className="login-error">{authError}</div> : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portal-shell">
      <aside className={sidebarCollapsed ? 'sidebar collapsed' : 'sidebar'}>
        <div className="brand-block">
          <div className="brand-row">
            <img src={logoLis} alt="Logo LIS" className="brand-logo" />
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed((current) => !current)}
              aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          </div>
          {!sidebarCollapsed ? (
            <div className="brand-copy">
              <strong>Portal DPO SIBATE</strong>
              <span>Cadena de valor</span>
            </div>
          ) : null}
        </div>

        <nav className="nav-panel" aria-label="Módulos del portal">
          {Object.keys(modules).map((name) => (
            <button
              key={name}
              type="button"
              className={name === activeModule ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveModule(name)}
            >
              <span className="nav-icon">{name === 'Seguridad' ? '🛡️' : name === 'Flota' ? '🚚' : '✅'}</span>
              {!sidebarCollapsed ? <span className="nav-text">{name}</span> : null}
            </button>
          ))}
        </nav>

        <div className={sidebarCollapsed ? 'sidebar-card collapsed' : 'sidebar-card'}>
          {!sidebarCollapsed ? (
            <>
              <p>Semana operativa</p>
              <strong>08 / 52</strong>
              <small>Meta de cumplimiento: 95%</small>
            </>
          ) : (
            <strong>08</strong>
          )}
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel de gestión</p>
            <h1>Portal DPO SIBATE</h1>
          </div>
          <div className="topbar-actions">
            <div className="user-pill">
              <span>{authUser.name}</span>
              <small>{authUser.role}</small>
            </div>
            <button type="button" className="secondary-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow accent">Módulo activo</p>
            <h2>{module.label}</h2>
            <p>{module.summary}</p>
            {module.ctaLink ? (
              <a
                href={module.ctaLink}
                target="_blank"
                rel="noreferrer"
                className="cta-link"
              >
                {module.ctaLabel}
              </a>
            ) : null}
          </div>

          <div className="hero-status">
            <span>Estado</span>
            <strong>{module.status}</strong>
          </div>
        </section>

        {activeModule === 'Administración' ? (
          <section className="admin-panel">
            {!canAccessAdminPanel ? (
              <div className="admin-access-denied">
                <h3>Acceso restringido</h3>
                <p>Este módulo solo está disponible para administradores autorizados.</p>
              </div>
            ) : (
              <>
                <div className="admin-header-row">
                  <div>
                    <p className="eyebrow accent">Administración</p>
                    <h3>Usuarios, permisos y auditoría</h3>
                  </div>
                  <button type="button" className="primary-button" onClick={refreshAdminData}>Actualizar</button>
                </div>

                {portalAnalytics ? (
                  <>
                    <div className="admin-analytics-grid">
                      <article className="stat-card compact">
                        <span>Usuarios activos</span>
                        <strong>{portalAnalytics.summary.activeUsers}</strong>
                        <small>activos hoy</small>
                      </article>
                      <article className="stat-card compact">
                        <span>Sesiones</span>
                        <strong>{portalAnalytics.summary.totalSessions}</strong>
                        <small>autenticaciones</small>
                      </article>
                      <article className="stat-card compact">
                        <span>Rendimiento</span>
                        <strong>{portalAnalytics.summary.performanceScore}%</strong>
                        <small>score general</small>
                      </article>
                      <article className="stat-card compact">
                        <span>Error rate</span>
                        <strong>{portalAnalytics.summary.errorRate}%</strong>
                        <small>fallos del sistema</small>
                      </article>
                    </div>

                    <div className="admin-analytics-chart panel-card">
                      <div className="panel-header">
                        <h3>Uso por día</h3>
                        <span className="admin-chart-caption">Últimos 7 días</span>
                      </div>

                      <div className="admin-chart-grid">
                        {(portalAnalytics.usageByDay || []).map((day) => {
                          const maxSessions = Math.max(
                            1,
                            ...(portalAnalytics.usageByDay || []).map((item) => Number(item.sessions) || 0),
                          )
                          const barHeight = Math.max(18, ((Number(day.sessions) || 0) / maxSessions) * 100)

                          return (
                            <div key={day.date} className="admin-chart-bar-group" title={`${day.sessions} sesiones • ${day.users} usuarios`}>
                              <span className="admin-chart-value">{day.sessions}</span>
                              <div className="admin-chart-bar-shell">
                                <div className="admin-chart-bar" style={{ height: `${barHeight}%` }} />
                              </div>
                              <span className="admin-chart-date">
                                {new Date(day.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="admin-chart-legend">
                        <span><i className="admin-chart-dot blue" />Usuarios activos</span>
                        <span><i className="admin-chart-dot red" />Sesiones autenticadas</span>
                      </div>
                    </div>
                  </>
                ) : null}

                {adminNotice ? <div className="admin-notice">{adminNotice}</div> : null}

                <div className="admin-creation-card panel-card">
                  <div className="panel-header">
                    <h3>Crear usuario</h3>
                  </div>

                  <form className="admin-form" onSubmit={createUser}>
                    <label>
                      <span>Nombre</span>
                      <input
                        type="text"
                        value={newUser.name}
                        onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Nombre del usuario"
                      />
                    </label>

                    <label>
                      <span>Correo institucional</span>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))}
                        placeholder="usuario@lis.com.co"
                      />
                    </label>

                    <label>
                      <span>Rol</span>
                      <select
                        value={newUser.role}
                        onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value }))}
                      >
                        <option value="viewer">viewer</option>
                        <option value="acis">acis</option>
                        <option value="seguridad">seguridad</option>
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                      </select>
                    </label>

                    <label>
                      <span>Estado</span>
                      <select
                        value={newUser.status}
                        onChange={(event) => setNewUser((current) => ({ ...current, status: event.target.value }))}
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                        <option value="pending">pending</option>
                      </select>
                    </label>

                    <button type="submit" className="primary-button" disabled={creatingUser}>
                      {creatingUser ? 'Creando...' : 'Crear usuario'}
                    </button>
                  </form>
                </div>

                <div className="admin-stack">
                  <div className="panel-card admin-card admin-user-table-card">
                    <div className="panel-header">
                      <h3>Usuarios</h3>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminUsers.map((user) => (
                            <tr key={user.email}>
                              <td>
                                <div className="admin-user-cell">
                                  <strong>{user.name}</strong>
                                  <small>{user.email}</small>
                                </div>
                              </td>
                              <td>
                                <select
                                  value={user.role}
                                  onChange={(event) => updateUserRole(user.email, event.target.value)}
                                  className="admin-select"
                                >
                                  <option value="viewer">viewer</option>
                                  <option value="acis">acis</option>
                                  <option value="seguridad">seguridad</option>
                                  <option value="admin">admin</option>
                                  <option value="superadmin">superadmin</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  value={user.status || 'active'}
                                  onChange={(event) => updateUserStatus(user.email, event.target.value)}
                                  className="admin-select"
                                >
                                  <option value="active">active</option>
                                  <option value="inactive">inactive</option>
                                  <option value="pending">pending</option>
                                </select>
                              </td>
                              <td>
                                <span className={`status-pill ${user.status === 'active' ? 'good' : 'warn'}`}>
                                  {user.status || 'active'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="panel-card admin-card admin-log-table-card">
                    <div className="panel-header">
                      <h3>Registro de auditoría</h3>
                    </div>
                    <div className="audit-table-wrap">
                      <table className="audit-table">
                        <thead>
                          <tr>
                            <th>Evento</th>
                            <th>Usuario</th>
                            <th>Módulo</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminAuditLogs.slice(0, 8).map((log) => (
                            <tr key={log.id}>
                              <td>{log.action}</td>
                              <td>{log.email}</td>
                              <td>{log.module}</td>
                              <td>{new Date(log.created_at).toLocaleString()}</td>
                              <td>
                                <span className={log.success ? 'status-pill good' : 'status-pill critical'}>
                                  {log.success ? 'OK' : 'FALLÓ'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        ) : null}

        {activeModule === 'Seguridad' ? (
          <section className="security-submodule-panel">
            <aside className="security-submodule-sidebar">
              <div className="security-submodule-header-block">
                <span className="security-submodule-label">Submodulos</span>
              </div>

              {Object.keys(securitySubmodules).map((name) => (
                <button
                  key={name}
                  type="button"
                  className={name === activeSecuritySubmodule ? 'security-submodule-item active' : 'security-submodule-item'}
                  onClick={() => setActiveSecuritySubmodule(name)}
                >
                  <span className="security-submodule-icon" aria-hidden="true">{securitySubmodules[name].icon}</span>
                  <span>{name}</span>
                </button>
              ))}
            </aside>

            <div className="security-submodule-content">
              <div className="security-submodule-topbar">
                <div>
                  <p className="eyebrow accent">{activeSecuritySection.tag}</p>
                  <h3>{activeSecuritySubmodule}</h3>
                </div>
                <span className={`security-status-pill ${complianceStatus.tone}`}>
                  {complianceStatus.value}
                </span>
              </div>

              <p className="security-submodule-summary">{activeSecuritySection.summary}</p>

              <div className="security-policy-banner">
                <strong>Política aplicada:</strong>
                <span>{securityPolicy.rules[0]}</span>
              </div>

              {activeSecuritySection.gallery ? (
                <div className="team-gallery">
                  {activeSecuritySection.gallery.map((person) => (
                    <article
                      key={person.name}
                      className="team-gallery-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedImage(person)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelectedImage(person)
                        }
                      }}
                    >
                      <div className="team-gallery-image-wrap">
                        <img src={person.image} alt={person.name} className="team-gallery-image" />
                      </div>
                      <div className="team-gallery-meta">
                        <strong>{person.name}</strong>
                        <span>{person.role}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}

              {activeSecuritySubmodule === 'ACIs' && activeSecuritySection.items ? (
                <div className="security-tier-wrapper">
                  <div className="security-tier-summary">
                    <div>
                      <p className="eyebrow accent">Clasificación de la información</p>
                      <strong>{activeSecuritySection.policyNote}</strong>
                    </div>
                    <div className="aci-visual-actions">
                      <span className="security-tier-badge">Nivel de acceso: {currentUserAccessLevel}</span>
                      <button type="button" className="secure-visual-button" onClick={openSecureAciView}>
                        Ver visual autorizada
                      </button>
                    </div>
                  </div>

                  {aciAccessDenied ? (
                    <div className="security-redacted-box aci-denied-box" role="alert">
                      <div className="security-redacted-topline">
                        <span className="security-redacted-lock">🔒</span>
                        <strong>Acceso restringido</strong>
                      </div>
                      <p>Esta vista solo está disponible para usuarios con credenciales y permisos de autorización.</p>
                    </div>
                  ) : null}

                  <div className="security-tier-list">
                    {['public', 'internal', 'confidential', 'restricted'].map((level) => (
                      <div key={level} className={`security-tier-item ${level}`}>
                        <span>{level.toUpperCase()}</span>
                        <small>
                          {level === 'public' && 'Visible para todos'}
                          {level === 'internal' && 'Uso interno'}
                          {level === 'confidential' && 'Autorizado'}
                          {level === 'restricted' && 'Máximo control'}
                        </small>
                      </div>
                    ))}
                  </div>

                  <div className="security-submodule-grid">
                    {activeSecuritySection.items.map((item) => {
                      const isVisible = canAccessInformationLevel(item.level)

                      return (
                        <article key={item.title} className={`security-submodule-card ${item.tone}`}>
                          <div className="security-submodule-card-top">
                            <span className="security-mini-bullet" aria-hidden="true" />
                            <strong>{item.title}</strong>
                          </div>

                          {isVisible ? (
                            <>
                              <p>{item.description}</p>
                              <div className="security-detail-box">
                                <span className="security-detail-label">{item.level.toUpperCase()}</span>
                                <p>{item.detail}</p>
                              </div>
                            </>
                          ) : (
                            <div className="security-redacted-box" aria-label="Información protegida por nivel de seguridad">
                              <div className="security-redacted-topline">
                                <span className="security-redacted-lock">🔒</span>
                                <strong>Información protegida</strong>
                              </div>
                              <p>Contenido restringido por política de seguridad de la información.</p>
                            </div>
                          )}
                        </article>
                      )
                    })}
                  </div>

                  <div className="security-controls-panel">
                    <h4>Controles de seguridad aplicados</h4>
                    <ul>
                      {activeSecuritySection.securityControls.map((control) => (
                        <li key={control}>{control}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {activeSecuritySection.tools ? (
                <div className={activeSecuritySubmodule === 'NOTI OL' ? 'notiol-video-grid' : 'inspection-tools-grid'}>
                  {activeSecuritySection.tools.map((tool) => {
                    if (activeSecuritySubmodule === 'NOTI OL') {
                      return (
                        <article key={tool.name} className="notiol-video-card">
                          <div className="notiol-video-header">
                            <div className="inspection-tool-icon" aria-hidden="true">🎬</div>
                            <div className="inspection-tool-copy">
                              <strong>{tool.name}</strong>
                              <p>{tool.description}</p>
                            </div>
                          </div>

                          <div className="notiol-video-frame-wrap">
                            <iframe
                              className="notiol-video-frame"
                              src={tool.embedUrl || tool.link}
                              title={tool.name}
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>

                          <a href={tool.link} target="_blank" rel="noreferrer" className="notiol-video-link">
                            Abrir video
                          </a>
                        </article>
                      )
                    }

                    return (
                      <a
                        key={tool.name}
                        href={tool.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inspection-tool-card"
                      >
                        <div className="inspection-tool-icon" aria-hidden="true">🧰</div>
                        <div className="inspection-tool-copy">
                          <strong>{tool.name}</strong>
                          <p>{tool.description}</p>
                        </div>
                        <span className="inspection-tool-action">Abrir</span>
                      </a>
                    )
                  })}
                </div>
              ) : null}

              {activeSecuritySection.trainingGroups ? (
                <div className="training-groups">
                  {activeSecuritySection.trainingGroups.map((group) => (
                    <div key={group.label} className="training-group">
                      <h4 className="training-group-title">{group.label}</h4>
                      <div className="inspection-tools-grid">
                        {group.items.map((training) => (
                          <a
                            key={training.name}
                            href={training.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inspection-tool-card"
                          >
                            <div className="inspection-tool-icon" aria-hidden="true">🎯</div>
                            <div className="inspection-tool-copy">
                              <strong>{training.name}</strong>
                              <p>{training.description}</p>
                            </div>
                            <span className="inspection-tool-action">Abrir</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeSecuritySubmodule === 'Preguntas frecuentes' ? (
                <div className="faq-form-panel">
                  <div className="faq-header-row">
                    <div>
                      <p className="eyebrow accent">Buzón interno</p>
                      <h4>Consulta al área de seguridad</h4>
                    </div>
                    <span className="faq-badge">Respuesta en 48 horas</span>
                  </div>

                  <form className="faq-form" onSubmit={handleFaqSubmit}>
                    <div className="faq-grid">
                      <label className="faq-field">
                        <span>Nombre</span>
                        <input
                          type="text"
                          value={faqForm.name}
                          onChange={(event) => setFaqForm((current) => ({ ...current, name: event.target.value }))}
                          placeholder="Tu nombre"
                          required
                        />
                      </label>

                      <label className="faq-field">
                        <span>Correo</span>
                        <input
                          type="email"
                          value={faqForm.email}
                          onChange={(event) => setFaqForm((current) => ({ ...current, email: event.target.value }))}
                          placeholder="usuario@lis.com.co"
                          required
                        />
                      </label>

                      <label className="faq-field">
                        <span>Área</span>
                        <select
                          value={faqForm.area}
                          onChange={(event) => setFaqForm((current) => ({ ...current, area: event.target.value }))}
                        >
                          <option value="Seguridad">Seguridad</option>
                          <option value="Operación">Operación</option>
                          <option value="Calidad">Calidad</option>
                          <option value="Flota">Flota</option>
                          <option value="Administración">Administración</option>
                        </select>
                      </label>

                      <label className="faq-field">
                        <span>Tipo</span>
                        <select
                          value={faqForm.category}
                          onChange={(event) => setFaqForm((current) => ({ ...current, category: event.target.value }))}
                        >
                          <option value="Pregunta">Pregunta</option>
                          <option value="Sugerencia">Sugerencia</option>
                          <option value="Reporte">Reporte</option>
                          <option value="Incidente">Incidente</option>
                        </select>
                      </label>
                    </div>

                    <label className="faq-field full-width">
                      <span>Asunto</span>
                      <input
                        type="text"
                        value={faqForm.subject}
                        onChange={(event) => setFaqForm((current) => ({ ...current, subject: event.target.value }))}
                        placeholder="Escribe el asunto o la duda principal"
                        required
                      />
                    </label>

                    <label className="faq-field full-width">
                      <span>Mensaje</span>
                      <textarea
                        rows="6"
                        value={faqForm.message}
                        onChange={(event) => setFaqForm((current) => ({ ...current, message: event.target.value }))}
                        placeholder="Describe tu consulta, observación o recomendación para seguridad..."
                        required
                      />
                    </label>

                    <div className="faq-form-actions">
                      <button type="submit" className="primary-button">Enviar consulta</button>
                    </div>

                    {faqSubmitted ? (
                      <div className="faq-success" role="status">
                        Consulta enviada correctamente. El área de seguridad revisará tu mensaje.
                      </div>
                    ) : null}
                  </form>
                </div>
              ) : null}

              {!activeSecuritySection.gallery && !activeSecuritySection.tools && !activeSecuritySection.trainingGroups && activeSecuritySubmodule !== 'Preguntas frecuentes' ? (
                <div className="security-submodule-grid">
                  {activeSecuritySection.items.map((item) => (
                    <article key={item.title} className={`security-submodule-card ${item.tone}`}>
                      <div className="security-submodule-card-top">
                        <span className="security-mini-bullet" aria-hidden="true" />
                        <strong>{item.title}</strong>
                      </div>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : activeModule === 'Seguridad' && module.featureCards ? (
          <section className="safety-feature-strip">
            {module.featureCards.map((card) => (
              <a
                key={card.title}
                href={card.link}
                target={card.link.startsWith('http') ? '_blank' : undefined}
                rel={card.link.startsWith('http') ? 'noreferrer' : undefined}
                className="feature-card"
              >
                <div className="feature-icon">{card.icon}</div>
                <div>
                  <strong>{card.title}</strong>
                  <p>{card.text}</p>
                </div>
              </a>
            ))}
          </section>
        ) : null}

        {activeModule !== 'Administración' ? (
          <>
            <section className="stats-grid">
              {module.kpis.map((item) => (
                <article className="stat-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.meta}</small>
                </article>
              ))}
            </section>

            <section className="content-grid">
              <article className="panel-card">
                <div className="panel-header">
                  <h3>{module.listTitle}</h3>
                  <button type="button" className="link-button">
                    Ver historial
                  </button>
                </div>

                <ul className="info-list">
                  {module.list.map((entry) => (
                    <li key={entry.item}>
                      <span>{entry.item}</span>
                      <strong className={entry.result === 'OK' || entry.result === 'CUMPLE' ? 'success' : entry.result === 'ALERTA' ? 'warning' : 'neutral'}>
                        {entry.result}
                      </strong>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="panel-card">
                <div className="panel-header">
                  <h3>Indicadores destacados</h3>
                </div>

                <div className="highlight-list">
                  {module.highlights.map((item) => (
                    <div className={`highlight-item ${item.tone}`} key={item.title}>
                      <div className="highlight-bullet" aria-hidden="true" />
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="panel-card actions-card">
              <div className="panel-header">
                <h3>Acciones prioritarias</h3>
              </div>

              <ul className="action-list">
                {module.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        <footer className="portal-footer">
          © Logistica Inteligente Solution 2026. Todos los derechos reservados.
        </footer>
      </main>

      {showSecureAciView ? (
        <div className="secure-page-backdrop" role="dialog" aria-modal="true" aria-label="Visual autorizada de ACIs">
          <div className="secure-page-shell">
            <div className="secure-page-header">
              <div>
                <p className="eyebrow accent">Vista segura</p>
                <h3>Visual autorizada de ACIs</h3>
              </div>
              <button type="button" className="secure-page-close" onClick={closeSecureAciView}>
                Cerrar
              </button>
            </div>

            <div className="secure-page-content">
              {aciIframeBlocked ? (
                <div className="secure-page-fallback">
                  <div className="secure-page-warning">🔒</div>
                  <h4>Acceso autorizado requerido</h4>
                  <p>Google Sites bloquea la incrustación directa por política del proveedor. La página completa de ACIs se abre en una pestaña segura para visualizarla sin restricciones.</p>
                  <a href={aciVisualUrl} target="_blank" rel="noreferrer" className="secure-visual-link">
                    Abrir página completa de ACIs
                  </a>
                </div>
              ) : (
                <iframe
                  className="aci-iframe"
                  src={aciVisualUrl}
                  title="Visual autorizada de ACIS"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="fullscreen"
                  onError={() => setAciIframeBlocked(true)}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}

      {selectedImage ? (
        <div
          className="image-modal-backdrop"
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <div className="image-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={selectedImage.name}>
            <button
              type="button"
              className="image-modal-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Cerrar imagen"
            >
              ×
            </button>
            <img src={selectedImage.image} alt={selectedImage.name} className="image-modal-image" />
            <div className="image-modal-caption">
              <strong>{selectedImage.name}</strong>
              <span>{selectedImage.role}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
