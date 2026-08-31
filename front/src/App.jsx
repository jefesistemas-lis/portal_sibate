import { useState } from 'react'
import './App.css'

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
}

function App() {
  const [activeModule, setActiveModule] = useState('Seguridad')
  const module = modules[activeModule]

  return (
    <div className="portal-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">CD</div>
          <div>
            <strong>CD Sibate</strong>
            <span>Portal DPO</span>
          </div>
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
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p>Semana operativa</p>
          <strong>08 / 52</strong>
          <small>Meta de cumplimiento: 95%</small>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel de gestión</p>
            <h1>Portal DPO</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="secondary-button">
              Exportar
            </button>
            <button type="button" className="primary-button">
              Nuevo reporte
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

        {activeModule === 'Seguridad' && module.featureCards ? (
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
      </main>
    </div>
  )
}

export default App
