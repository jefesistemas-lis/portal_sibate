import { useState } from 'react'
import './App.css'

const modules = {
  Seguridad: {
    label: 'Seguridad',
    status: 'Operación estable',
    summary:
      'Monitoreo de protocolos, capacitaciones y gestión de riesgos para mantener la operación segura y conforme.',
    kpis: [
      { label: 'Cumplimiento', value: '96%', meta: '+4% vs. mes anterior' },
      { label: 'Capacitaciones', value: '18', meta: '3 pendientes' },
      { label: 'Incidentes', value: '02', meta: 'Sin gravedad alta' },
      { label: 'Auditorías', value: '6/7', meta: '1 programada' },
    ],
    highlights: [
      { title: 'Revisión de EPP', detail: '100% de equipos con inspección vigente.', tone: 'good' },
      { title: 'Riesgo de SSO', detail: 'Se requieren 2 indicadores críticos para cierre.', tone: 'warn' },
      { title: 'Entrega de brigadas', detail: 'Plan de respuesta activado en 3 turnos.', tone: 'good' },
    ],
    listTitle: 'Seguimiento operativo',
    list: [
      { item: 'Inspección de estaciones de trabajo', result: 'OK' },
      { item: 'Control de accesos a zonas restringidas', result: 'OK' },
      { item: 'Capacitación en ergonomía', result: 'En curso' },
      { item: 'Reporte de incidentes mensuales', result: 'Sin novedades' },
    ],
    actions: [
      'Confirmar cumplimiento de checklist semanal en todas las áreas.',
      'Programar auditoría de seguridad para el próximo viernes.',
      'Cierre del plan de acción de riesgo SSO antes del 12 de septiembre.',
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
          </div>

          <div className="hero-status">
            <span>Estado</span>
            <strong>{module.status}</strong>
          </div>
        </section>

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
