/* Grupo Finvivir · Plataforma de Recuperación — lógica de la aplicación */
/* ══════════════════════════════════════════════════════════════════
   1. CONFIGURACIÓN / PARÁMETROS DEL SISTEMA
   ══════════════════════════════════════════════════════════════════ */
const PARAMS = [
  /* ── Metas y rendimiento ─────────────────────────────────────────── */
  {g:'Metas y rendimiento',
   k:'META_CATORCENAL',          v:9000,  t:'número',     d:'Meta de recuperación por catorcena y ejecutivo. Sin límite fijo: el negocio define el valor.', crit:true},
  {g:'Metas y rendimiento',
   k:'META_DIARIA',              v:600,   t:'número',     d:'Meta de recuperación diaria por ejecutivo. Sin límite fijo: el negocio define el valor.',      crit:false},
  {g:'Metas y rendimiento',
   k:'UMBRAL_LOGRO_OBJETIVO',    v:70,    t:'porcentaje', d:'% de cumplimiento de meta mínimo para considerar a un ejecutivo en objetivo (semáforo verde)', crit:true, min:50, max:100},
  {g:'Metas y rendimiento',
   k:'UMBRAL_LOGRO_RIESGO',      v:50,    t:'porcentaje', d:'% de cumplimiento mínimo para semáforo ámbar. Por debajo = zona crítica y alertas de atención', crit:true, min:20, max:90},
  {g:'Metas y rendimiento',
   k:'UMBRAL_ALERTA_JEFATURA',   v:65,    t:'porcentaje', d:'% de cumplimiento por debajo del cual la jefatura recibe alerta de intervención en el tablero', crit:false, min:40, max:95},

  /* ── Mora y dictaminación ────────────────────────────────────────── */
  {g:'Mora y dictaminación',
   k:'DIAS_MORA_MEDIA',          v:90,    t:'número',     d:'Días de vencimiento a partir de los cuales el semáforo pasa de azul a ámbar (mora media)',    crit:true,  min:30, max:180},
  {g:'Mora y dictaminación',
   k:'DIAS_MORA_ESCALACION',     v:180,   t:'número',     d:'Días de vencimiento desde los cuales se activa el proceso de dictaminación (mora alta)',       crit:true,  min:90, max:365},
  {g:'Mora y dictaminación',
   k:'DIAS_QUEBRANTO',           v:365,   t:'número',     d:'Días de vencimiento para tratamiento de quebranto contable',                                    crit:true,  min:180, max:730},

  /* ── Compromisos de pago ─────────────────────────────────────────── */
  {g:'Compromisos de pago',
   k:'DIAS_COMPROMISO_URGENTE',  v:3,     t:'número',     d:'Días o menos para que un compromiso de pago se marque como Urgente (rojo)',                    crit:false, min:1, max:7},
  {g:'Compromisos de pago',
   k:'DIAS_COMPROMISO_PROXIMO',  v:7,     t:'número',     d:'Días o menos para que un compromiso se marque como Próximo (ámbar)',                           crit:false, min:3, max:14},
  {g:'Compromisos de pago',
   k:'HORIZONTE_COMPROMISOS',    v:15,    t:'número',     d:'Días hacia adelante que se muestran en los paneles de compromisos próximos',                   crit:false, min:7, max:30},

  /* ── Indicadores de riesgo (PAR) ─────────────────────────────────── */
  {g:'Indicadores de riesgo (PAR)',
   k:'PAR30_ALERTA',             v:8,     t:'porcentaje', d:'PAR 30 a partir del cual la jefatura entra en estado Vigilar',                                 crit:true,  min:3, max:20},
  {g:'Indicadores de riesgo (PAR)',
   k:'PAR30_CRITICO',            v:12,    t:'porcentaje', d:'PAR 30 a partir del cual la jefatura requiere Intervención',                                   crit:true,  min:5, max:30},
  {g:'Indicadores de riesgo (PAR)',
   k:'PAR90_ALERTA',             v:5,     t:'porcentaje', d:'PAR 90 a partir del cual la jefatura entra en estado Vigilar',                                 crit:true,  min:2, max:15},
  {g:'Indicadores de riesgo (PAR)',
   k:'PAR90_CRITICO',            v:7,     t:'porcentaje', d:'PAR 90 a partir del cual la jefatura requiere Intervención',                                   crit:true,  min:3, max:20},

  /* ── Operación general ───────────────────────────────────────────── */
  {g:'Operación general',
   k:'MONEDA_SISTEMA',           v:'MXN', t:'lista',      d:'Moneda en la que opera esta instancia del sistema. Cada país de Grupo Finvivir corre su propia instancia — no se consolidan montos entre monedas.', crit:true, opciones:['MXN','PEN','COP']},
  {g:'Operación general',
   k:'MAX_INTENTOS_FALLIDOS',    v:5,     t:'número',     d:'Intentos fallidos consecutivos tras los cuales la cuenta se bloquea automáticamente.', crit:true,  min:3, max:10},
  {g:'Operación general',
   k:'CANAL_REPORTE',            v:'ysanchez@finvivir.com', t:'texto',      d:'Destino del botón "Reportar algo" de la prueba de campo. Acepta un número de WhatsApp (solo dígitos con lada, ej. 5213312345678) o un correo. Si se deja vacío, el botón no aparece.', crit:false},
  {g:'Operación general',
   k:'BANNER_SIMULACION',        v:true,  t:'booleano',   d:'Muestra la barra permanente que advierte que es una simulación sin persistencia. Mantener encendido en cualquier ambiente que no sea productivo.', crit:true},
  {g:'Operación general',
   k:'MODO_DEMO',                v:false,  t:'booleano',   d:'Muestra los accesos rápidos por perfil y el selector "Ver como". APAGARLO para una prueba de campo: obliga a cada usuario a entrar con su propia contraseña.', crit:true},
  {g:'Operación general',
   k:'MAX_CUENTAS_POR_EJECUTIVO',v:50,    t:'número',     d:'Tope máximo de cuentas asignables a un ejecutivo simultáneamente',                             crit:false, min:1, max:1000},
  {g:'Operación general',
   k:'DURACION_CATORCENA',       v:14,    t:'número',     d:'Días naturales por catorcena (normalmente 14, puede ajustarse por calendario)',                 crit:true,  min:12, max:16},
  {g:'Operación general',
   k:'SEMANAS_DESDE_ASIGNACION',  v:2,     t:'número',     d:'Semanas desde asignación tras las cuales un FALCO no recuperado se marca en riesgo (rojo). El escalamiento sigue siendo manual.', crit:false, min:1, max:8},
  {g:'Operación general',
   k:'SEMANAS_HISTORIAL_MAX',    v:53,    t:'número',     d:'Número máximo de semanas a mostrar en el historial de catorcenas del ejecutivo',               crit:false, min:13, max:104},

  /* ── Funcionalidades opcionales ──────────────────────────────────── */
  {g:'Funcionalidades',
   k:'HABILITAR_GPS',            v:true,  t:'booleano',   d:'Capturar coordenadas GPS al registrar una gestión en campo',                                   crit:false},
  {g:'Funcionalidades',
   k:'HABILITAR_WHATSAPP',       v:true,  t:'booleano',   d:'Permitir el envío de comprobante de pago por WhatsApp al momento del registro',                crit:false},
  {g:'Funcionalidades',
   k:'MODO_VALIDACION_VISITA',   v:true,  t:'booleano',   d:'Requerir que la jefatura valide la visita del ejecutivo antes de contabilizarla como realizada', crit:false},
];
const P = k => (PARAMS.find(p=>p.k===k)||{}).v;
/* Monedas soportadas — Latinoamérica. Una instancia del sistema opera con una sola moneda. */
const MONEDA_INFO = {
  MXN: { simbolo:'$',  locale:'es-MX', nombre:'Peso mexicano' },
  PEN: { simbolo:'S/', locale:'es-PE', nombre:'Sol peruano' },
  COP: { simbolo:'$',  locale:'es-CO', nombre:'Peso colombiano' },
};

const CATALOGOS = {
  TIPO_GESTION:   ['Pago total','Pago parcial','Promesa de pago','Convenio','Sin contacto','Negativa de pago','Cambio de domicilio','Ilocalizable','Dictaminación'],
  ESTATUS_CUENTA: ['En gestión','Con promesa vigente','Convenio activo','Dictaminación propuesta','Liquidado pendiente Core','Liquidado','Quebranto'],
  MOTIVO_FALCO:   ['Pago entregado y no aplicado','Robo o pérdida','Uso indebido de recursos','Diferencia en corte','Otro'],
  MOTIVO_DICTAMINACION: [
    'Liquidado',
    'Ilocalizable',
    'Negativa de pago',
    'Fraude',
    'Fallecimiento',
    'Riesgo operativo',
    'Irrecuperable',
    'Demanda'
  ],
  DESC_DICTAMINACION: {
    'Liquidado':        'La cuenta fue pagada o cerrada correctamente.',
    'Ilocalizable':     'No se logró ubicar a la clienta tras gestiones documentadas.',
    'Negativa de pago': 'Cliente tiene solvencia, pero se rehúsa a realizar el pago.',
    'Fraude':           'Existen indicios o evidencia de engaño o mala práctica.',
    'Fallecimiento':    'Se confirma el fallecimiento de la titular.',
    'Riesgo operativo': 'La gestión se ve limitada por condiciones externas.',
    'Irrecuperable':    'Baja o nula probabilidad de recuperación tras agotar la gestión.',
    'Demanda':          'Candidata a escalamiento legal por negativa de pago.'
  },
  CATEGORIA_LIDER: ['Confiable','En observación','Riesgo alto','Nuevo'],
  MOTIVO_NO_PAGO: ['Sin recursos','Enfermedad','Desempleo','Migración','Negativa expresa','No localizado','Fallecimiento','Crisis de negocio','Emergencia familiar','Disputas internas del grupo','Causa desconocida'],
  ETAPAS:         ['Cobranza sana','Mora temprana','Mora administrativa','Recuperación especializada','Tratamiento final','Quebranto'],

  /* ── Nuevos catálogos (editables por adminCfg) ─────────────────── */
  /* Esta instancia opera un único país (una instancia = un país), igual que MONEDA_SISTEMA.
     Si Grupo Finvivir despliega una instancia nueva para otro país, este catálogo se
     ajusta en esa instancia — no se administran varios países desde la misma instalación. */
  PAISES_ACTIVOS:  ['México'],
  MARCAS_CREDITO:  ['Finvivir','Crédito Mujer','Crédito Semilla','Crédito Negocio','Crédito Mejora'],
  REGIONES:        ['Jalisco','Nayarit','Colima','Bajío','Occidente','Oriente','Sur','Norte'],
  MOTIVO_RECHAZO_DICT: [
    'Documentación insuficiente',
    'Gestión no completada',
    'Inconsistencia en el expediente',
    'Contacto reciente confirmado',
    'Acuerdo de pago en proceso',
    'Requiere validación de campo adicional'
  ],
  DOCUMENTOS_DICT: ['INE/IFE','Acta de defunción','Carta de testimonio','Reporte policial','Evidencia fotográfica','Informe de campo','Dictamen médico']
};

/* ══════════════════════════════════════════════════════════════════
   2. ROLES Y NAVEGACIÓN
   ══════════════════════════════════════════════════════════════════ */
const ROLES = {
  ejecutivo:{label:'Ejecutivo de Recuperación', persona:'Felipe Ramírez', alcance:'Cartera propia · Jalisco, Nayarit',
    menu:[['',['notifs']],['Operación',['miDia','miCartera','planeacion']],['Seguimiento',['misCatorcenas']]]},
  jefatura:{label:'Jefatura de Recuperación', persona:'Carmen Vega', alcance:'5 ejecutivos · Jalisco, Nayarit',
    menu:[['',['notifsJef']],['Supervisión',['tabJefe','carteraEquipo','agendaEquipo','dictJefe']],['Gestión',['asignacion','falcoAsig']]]},
  gerencia:{label:'Gerencia de Recuperación', persona:'Laura Méndez', alcance:'País: México · 3 regiones',
    menu:[['',['notifsJef']],['Supervisión',['tabGer','carterasGer','dictGer']]]},
  comercial:{label:'Jefatura Comercial', persona:'Diana Soto', alcance:'Colocación Jalisco · solo consulta en recuperación',
    menu:[['Reportes de campo',['falcoForm']],['Consulta',['consultaCom']]]},
  director:{label:'Director de Unidad de Negocio', persona:'Roberto Ávila', alcance:'México · alineación estratégica de la unidad de negocio',
    menu:[['Visión global',['tabDir']]]},
  adminSeg:{label:'Administrador de Seguridad', persona:'Sofía Admin', alcance:'Global · sin acceso operativo',
    menu:[['Identidad',['usuarios','matriz']],['Auditoría',['bitacoraSeg']]]},
  adminCfg:{label:'Administrador de Configuración', persona:'Marco Dev', alcance:'Global · sin acceso operativo',
    menu:[['Configuración',['parametros','catalogos','catorcenasAdm']],['Auditoría',['bitacoraCfg']]]}
};
const NAV = {
  notifs:'🔔 Notificaciones', miDia:'📊 Resumen', miCartera:'📁 Mi Cartera', planeacion:'🗓️ Planeación Semanal', misCatorcenas:'📈 Mis Catorcenas',
  tabJefe:'📊 Tablero de Equipo', carteraEquipo:'📁 Cartera del Equipo', agendaEquipo:'📅 Agenda del Equipo', asignacion:'👥 Asignación de Cartera', falcoAsig:'📮 Asignación de FALCO', dictJefe:'⚖️ Dictaminaciones',
  notifsJef:'🔔 Notificaciones', carterasGer:'📁 Cartera de Jefaturas', dictGer:'⚖️ Dictaminaciones',
  tabDir:'📊 Tablero Director', tabGer:'📊 Tablero Regional', 
  falcoForm:'📝 Reportar FALCO', consultaCom:'🔎 Consulta de Cuentas',
  usuarios:'🔐 Usuarios', matriz:'🧩 Matriz de Permisos', bitacoraSeg:'📋 Bitácora de Seguridad',
  parametros:'⚙️ Parámetros', catalogos:'📚 Catálogos', catorcenasAdm:'📅 Catorcenas del Año', bitacoraCfg:'📋 Bitácora de Configuración'
};

/* ══════════════════════════════════════════════════════════════════
   3. BASE DE DATOS EN MEMORIA
   ══════════════════════════════════════════════════════════════════ */
const HOY = new Date(); // Fecha real del sistema (automática)

const DB = {
  cuentas:[
    {id:'MX-018245',cliente:'Juana Pérez López',region:'Jalisco',ruta:'R-04',marca:'Finvivir',grupo:'Grupo Las Flores',lider:'María Luna',montoCredito:15000,adeudoAsig:8450,pagosCapt:1200,saldoReal:7250,diasVenc:212,prob:'Media',riesgo:'Alto',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Morelos 12, Col. Centro, Guadalajara, Jalisco',telefono:'33-1123-4456',aval:'Benito Ramírez',relacionAval:'Hermano',telefonoAval:'33-1123-9911',direccionAval:'Calle Morelos 40, Col. Centro, Guadalajara, Jalisco',plazo:52,pagoSemanal:250,pagosVencidos:8,pagosLiquidar:44,lat:20.6597,lon:-103.3496,paso:3},
    {id:'MX-020918',cliente:'Marta Gómez Ruiz',region:'Nayarit',ruta:'R-07',marca:'Finvivir',grupo:'Grupo Progreso',lider:'Ana Torres',montoCredito:10000,adeudoAsig:5120,pagosCapt:0,saldoReal:5120,diasVenc:198,prob:'Alta',riesgo:'Medio',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'Con promesa vigente',direccion:'Av. Hidalgo 45, Tepic, Nayarit',telefono:'33-2245-8890',aval:'Luis Gómez',relacionAval:'Esposo',telefonoAval:'33-2245-1200',direccionAval:'Av. Hidalgo 45, Tepic, Nayarit',plazo:52,pagoSemanal:200,pagosVencidos:6,pagosLiquidar:46,lat:21.5041,lon:-104.8942,paso:4},
    {id:'MX-017733',cliente:'Elena Díaz Mora',region:'Jalisco',ruta:'R-04',marca:'Crédito Mujer',grupo:'Grupo Las Flores',lider:'María Luna',montoCredito:18000,adeudoAsig:12300,pagosCapt:2300,saldoReal:10000,diasVenc:245,prob:'Baja',riesgo:'Alto',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'Dictaminación propuesta',direccion:'Priv. Juárez 8, Guadalajara, Jalisco',telefono:'33-3390-1122',aval:'—',relacionAval:'—',telefonoAval:'—',direccionAval:'—',plazo:52,pagoSemanal:300,pagosVencidos:10,pagosLiquidar:42,lat:null,lon:null,paso:5},
    {id:'MX-021990',cliente:'Rosa Jiménez Ortiz',region:'Colima',ruta:'R-11',marca:'Finvivir',grupo:'Grupo Unión',lider:'Lucía Ramos',montoCredito:8000,adeudoAsig:4300,pagosCapt:4300,saldoReal:0,diasVenc:191,prob:'Alta',riesgo:'Bajo',ejecutivo:'Jorge Núñez',jefatura:'Paola Vega',estatus:'Liquidado',direccion:'Calle 5 de Mayo 30, Colima',telefono:'33-4412-7788',aval:'Marta Ortiz',relacionAval:'Madre',telefonoAval:'33-4412-2233',direccionAval:'Calle 5 de Mayo 12, Colima',plazo:52,pagoSemanal:150,pagosVencidos:0,pagosLiquidar:0,lat:19.2433,lon:-103.7250,paso:6},
    {id:'MX-019004',cliente:'Sofía Herrera Cruz',region:'Jalisco',ruta:'R-05',marca:'Finvivir',grupo:'Grupo Amanecer',lider:'Rosa Bello',montoCredito:12000,adeudoAsig:6900,pagosCapt:900,saldoReal:6000,diasVenc:64,prob:'Alta',riesgo:'Medio',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Zaragoza 77, Zapopan, Jalisco',telefono:'33-5567-3311',aval:'Pedro Cruz',relacionAval:'Padre',telefonoAval:'33-5567-9090',direccionAval:'Calle Zaragoza 91, Zapopan, Jalisco',plazo:52,pagoSemanal:230,pagosVencidos:3,pagosLiquidar:48,lat:20.7214,lon:-103.3918,paso:2},
    {id:'MX-022145',cliente:'Lucía Navarro Peña',region:'Jalisco',ruta:'R-05',marca:'Crédito Mujer',grupo:'Grupo Amanecer',lider:'Rosa Bello',montoCredito:9000,adeudoAsig:3800,pagosCapt:1500,saldoReal:2300,diasVenc:37,prob:'Alta',riesgo:'Bajo',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'Convenio activo',direccion:'Av. Vallarta 900, Guadalajara, Jalisco',telefono:'33-2211-6677',aval:'Ivonne Peña',relacionAval:'Hermana',telefonoAval:'33-2211-1414',direccionAval:'Av. Vallarta 912, Guadalajara, Jalisco',plazo:52,pagoSemanal:180,pagosVencidos:2,pagosLiquidar:49,lat:20.6740,lon:-103.4060,paso:4},
    {id:'MX-016880',cliente:'Patricia Solís Vega',region:'Nayarit',ruta:'R-07',marca:'Finvivir',grupo:'Grupo Progreso',lider:'Ana Torres',montoCredito:20000,adeudoAsig:15600,pagosCapt:0,saldoReal:15600,diasVenc:301,prob:'Baja',riesgo:'Alto',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Allende 3, Tepic, Nayarit',telefono:'33-8890-4455',aval:'—',relacionAval:'—',telefonoAval:'—',direccionAval:'—',plazo:52,pagoSemanal:380,pagosVencidos:14,pagosLiquidar:38,lat:21.5100,lon:-104.9000,paso:2},
    {id:'MX-023301',cliente:'Verónica Lara Ibarra',region:'Jalisco',ruta:'R-04',marca:'Finvivir',grupo:'Grupo Las Flores',lider:'María Luna',montoCredito:7000,adeudoAsig:2400,pagosCapt:800,saldoReal:1600,diasVenc:12,prob:'Alta',riesgo:'Bajo',ejecutivo:'Mariana Ríos',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Colón 21, Guadalajara, Jalisco',telefono:'33-7788-2020',aval:'Raúl Ibarra',relacionAval:'Esposo',telefonoAval:'33-7788-3030',direccionAval:'Calle Colón 21, Guadalajara, Jalisco',plazo:52,pagoSemanal:140,pagosVencidos:1,pagosLiquidar:50,lat:20.6660,lon:-103.3520,paso:1},
    {id:'MX-015002',cliente:'Guadalupe Ríos Tapia',region:'Nayarit',ruta:'R-08',marca:'Crédito Mujer',grupo:'Grupo Esperanza',lider:'Nora Sandoval',montoCredito:16000,adeudoAsig:13900,pagosCapt:400,saldoReal:13500,diasVenc:388,prob:'Baja',riesgo:'Alto',ejecutivo:'Ana López',jefatura:'Carmen Vega',estatus:'Quebranto',direccion:'Calle Reforma 55, Tepic, Nayarit',telefono:'33-4455-8181',aval:'—',relacionAval:'—',telefonoAval:'—',direccionAval:'—',plazo:52,pagoSemanal:310,pagosVencidos:18,pagosLiquidar:34,lat:21.4980,lon:-104.8850,paso:5},
    {id:'MX-020440',cliente:'Beatriz Campos Ruelas',region:'Jalisco',ruta:'R-05',marca:'Finvivir',grupo:'Grupo Amanecer',lider:'Rosa Bello',montoCredito:11000,adeudoAsig:7700,pagosCapt:2100,saldoReal:5600,diasVenc:187,prob:'Media',riesgo:'Alto',ejecutivo:'Ana López',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Federalismo 210, Guadalajara, Jalisco',telefono:'33-9900-1212',aval:'Sergio Ruelas',relacionAval:'Hijo',telefonoAval:'33-9900-4343',direccionAval:'Calle Federalismo 188, Guadalajara, Jalisco',plazo:52,pagoSemanal:220,pagosVencidos:9,pagosLiquidar:43,lat:20.6820,lon:-103.3650,paso:3},
    {id:'MX-019887',cliente:'Teresa Valdez Nuño',region:'Jalisco',ruta:'R-04',marca:'Crédito Mujer',grupo:'Grupo Las Flores',lider:'María Luna',montoCredito:9500,adeudoAsig:6200,pagosCapt:0,saldoReal:6200,diasVenc:23,prob:'Alta',riesgo:'Bajo',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Independencia 140, Guadalajara, Jalisco',telefono:'33-1188-5522',aval:'Hugo Nuño',relacionAval:'Hermano',telefonoAval:'33-1188-7733',direccionAval:'Calle Independencia 155, Guadalajara, Jalisco',plazo:52,pagoSemanal:190,pagosVencidos:2,pagosLiquidar:49,lat:20.6710,lon:-103.3480,paso:1},
    {id:'MX-018106',cliente:'Carmen Ochoa Lira',region:'Jalisco',ruta:'R-05',marca:'Finvivir',grupo:'Grupo Amanecer',lider:'Rosa Bello',montoCredito:14500,adeudoAsig:9800,pagosCapt:0,saldoReal:9800,diasVenc:71,prob:'Media',riesgo:'Medio',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Av. Patria 610, Zapopan, Jalisco',telefono:'33-6644-2299',aval:'Delia Lira',relacionAval:'Madre',telefonoAval:'33-6644-8811',direccionAval:'Av. Patria 588, Zapopan, Jalisco',plazo:52,pagoSemanal:280,pagosVencidos:4,pagosLiquidar:47,lat:20.7050,lon:-103.4110,paso:1},
    {id:'MX-017204',cliente:'Silvia Barajas Cano',region:'Nayarit',ruta:'R-07',marca:'Crédito Mujer',grupo:'Grupo Progreso',lider:'Ana Torres',montoCredito:11500,adeudoAsig:8300,pagosCapt:0,saldoReal:8300,diasVenc:134,prob:'Media',riesgo:'Alto',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Veracruz 22, Tepic, Nayarit',telefono:'33-9922-4141',aval:'—',relacionAval:'—',telefonoAval:'—',direccionAval:'—',plazo:52,pagoSemanal:240,pagosVencidos:7,pagosLiquidar:45,lat:21.5060,lon:-104.8910,paso:1},
    {id:'MX-016455',cliente:'Dolores Pineda Rangel',region:'Nayarit',ruta:'R-08',marca:'Finvivir',grupo:'Grupo Esperanza',lider:'Nora Sandoval',montoCredito:17000,adeudoAsig:11900,pagosCapt:0,saldoReal:11900,diasVenc:206,prob:'Baja',riesgo:'Alto',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Puebla 71, Tepic, Nayarit',telefono:'33-3377-6060',aval:'Ismael Rangel',relacionAval:'Esposo',telefonoAval:'33-3377-9090',direccionAval:'Calle Puebla 71, Tepic, Nayarit',plazo:52,pagoSemanal:330,pagosVencidos:12,pagosLiquidar:40,lat:21.4950,lon:-104.8990,paso:1},
    {id:'MX-021512',cliente:'Yolanda Estrada Vidal',region:'Jalisco',ruta:'R-05',marca:'Finvivir',grupo:'Grupo Amanecer',lider:'Rosa Bello',montoCredito:8500,adeudoAsig:3900,pagosCapt:0,saldoReal:3900,diasVenc:9,prob:'Alta',riesgo:'Bajo',ejecutivo:'Felipe Ramírez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Ghilardi 55, Guadalajara, Jalisco',telefono:'33-2020-3131',aval:'Norma Vidal',relacionAval:'Hermana',telefonoAval:'33-2020-4242',direccionAval:'Calle Ghilardi 60, Guadalajara, Jalisco',plazo:52,pagoSemanal:165,pagosVencidos:1,pagosLiquidar:50,lat:20.6790,lon:-103.3600,paso:1},
    {id:'MX-021077',cliente:'Norma Aguilar Sosa',region:'Colima',ruta:'R-11',marca:'Finvivir',grupo:'Grupo Unión',lider:'Lucía Ramos',montoCredito:13000,adeudoAsig:9200,pagosCapt:3200,saldoReal:6000,diasVenc:96,prob:'Media',riesgo:'Medio',ejecutivo:'Jorge Núñez',jefatura:'Paola Vega',estatus:'Con promesa vigente',direccion:'Av. Tecnológico 12, Colima',telefono:'33-3322-7070',aval:'Elsa Sosa',relacionAval:'Madre',telefonoAval:'33-3322-8080',direccionAval:'Av. Tecnológico 30, Colima',plazo:52,pagoSemanal:260,pagosVencidos:5,pagosLiquidar:46,lat:19.2500,lon:-103.7100,paso:4},
    {id:'MX-018991',cliente:'Alicia Mendoza Rojas',region:'Colima',ruta:'R-12',marca:'Crédito Mujer',grupo:'Grupo Horizonte',lider:'Celia Duarte',montoCredito:14000,adeudoAsig:10100,pagosCapt:0,saldoReal:10100,diasVenc:229,prob:'Baja',riesgo:'Alto',ejecutivo:'Jorge Núñez',jefatura:'Paola Vega',estatus:'Dictaminación propuesta',direccion:'Calle Guerrero 88, Villa de Álvarez, Colima',telefono:'33-6060-1515',aval:'—',relacionAval:'—',telefonoAval:'—',direccionAval:'—',plazo:52,pagoSemanal:290,pagosVencidos:11,pagosLiquidar:41,lat:19.2700,lon:-103.7380,paso:5},
    {id:'MX-022680',cliente:'Fernanda Ríos Palacios',region:'Nayarit',ruta:'R-09',marca:'Finvivir',grupo:'Grupo Renacer',lider:'Ofelia Castañeda',montoCredito:10500,adeudoAsig:6800,pagosCapt:1300,saldoReal:5500,diasVenc:58,prob:'Alta',riesgo:'Medio',ejecutivo:'Rodrigo Salas',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Insurgentes 40, Tepic, Nayarit',telefono:'33-4488-2020',aval:'Julio Palacios',relacionAval:'Esposo',telefonoAval:'33-4488-3030',direccionAval:'Calle Insurgentes 40, Tepic, Nayarit',plazo:52,pagoSemanal:210,pagosVencidos:4,pagosLiquidar:48,lat:21.5020,lon:-104.8970,paso:2},
    {id:'MX-022715',cliente:'Gabriela Montes Reyes',region:'Nayarit',ruta:'R-09',marca:'Crédito Mujer',grupo:'Grupo Renacer',lider:'Ofelia Castañeda',montoCredito:9000,adeudoAsig:5200,pagosCapt:600,saldoReal:4600,diasVenc:29,prob:'Alta',riesgo:'Bajo',ejecutivo:'Rodrigo Salas',jefatura:'Carmen Vega',estatus:'Con promesa vigente',direccion:'Calle Juárez 15, Tepic, Nayarit',telefono:'33-4488-5050',aval:'Rosa Reyes',relacionAval:'Madre',telefonoAval:'33-4488-6060',direccionAval:'Calle Juárez 15, Tepic, Nayarit',plazo:52,pagoSemanal:175,pagosVencidos:1,pagosLiquidar:50,lat:21.5015,lon:-104.8955,paso:4},
    {id:'MX-022801',cliente:'Ximena Corona Villaseñor',region:'Jalisco',ruta:'R-06',marca:'Finvivir',grupo:'Grupo Fortaleza',lider:'Berenice Salcido',montoCredito:13500,adeudoAsig:8900,pagosCapt:2400,saldoReal:6500,diasVenc:45,prob:'Alta',riesgo:'Medio',ejecutivo:'Claudia Bermúdez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Calle Mezquitán 88, Guadalajara, Jalisco',telefono:'33-7711-4040',aval:'Iván Villaseñor',relacionAval:'Hermano',telefonoAval:'33-7711-5050',direccionAval:'Calle Mezquitán 88, Guadalajara, Jalisco',plazo:52,pagoSemanal:260,pagosVencidos:2,pagosLiquidar:49,lat:20.7010,lon:-103.3540,paso:3},
    {id:'MX-022834',cliente:'Perla Aceves Domínguez',region:'Nayarit',ruta:'R-09',marca:'Crédito Negocio',grupo:'Grupo Aurora',lider:'Leticia Farías',montoCredito:18000,adeudoAsig:13200,pagosCapt:1800,saldoReal:11400,diasVenc:82,prob:'Media',riesgo:'Alto',ejecutivo:'Claudia Bermúdez',jefatura:'Carmen Vega',estatus:'En gestión',direccion:'Av. México 220, Tepic, Nayarit',telefono:'33-7711-7070',aval:'—',relacionAval:'—',telefonoAval:'—',direccionAval:'—',plazo:52,pagoSemanal:340,pagosVencidos:6,pagosLiquidar:46,lat:21.5080,lon:-104.9010,paso:2},
    {id:'MX-023410',cliente:'Lorena Ibarra Zúñiga',region:'Bajío',ruta:'R-14',marca:'Finvivir',grupo:'Grupo Nuevo Amanecer',lider:'Alma Delgado',montoCredito:12000,adeudoAsig:7900,pagosCapt:1600,saldoReal:6300,diasVenc:67,prob:'Media',riesgo:'Medio',ejecutivo:'Ignacio Beltrán',jefatura:'Héctor Lomelí',estatus:'En gestión',direccion:'Calle Allende 45, León, Guanajuato',telefono:'47-7712-3040',aval:'Raquel Zúñiga',relacionAval:'Madre',telefonoAval:'47-7712-5060',direccionAval:'Calle Allende 45, León, Guanajuato',plazo:52,pagoSemanal:235,pagosVencidos:3,pagosLiquidar:48,lat:21.1250,lon:-101.6860,paso:2},
    {id:'MX-023455',cliente:'Adriana Vera Solano',region:'Bajío',ruta:'R-14',marca:'Crédito Negocio',grupo:'Grupo Nuevo Amanecer',lider:'Alma Delgado',montoCredito:16000,adeudoAsig:11400,pagosCapt:2100,saldoReal:9300,diasVenc:112,prob:'Baja',riesgo:'Alto',ejecutivo:'Ignacio Beltrán',jefatura:'Héctor Lomelí',estatus:'En gestión',direccion:'Blvd. Adolfo López Mateos 220, León, Guanajuato',telefono:'47-7788-1122',aval:'—',relacionAval:'—',telefonoAval:'—',direccionAval:'—',plazo:52,pagoSemanal:310,pagosVencidos:8,pagosLiquidar:44,lat:21.1180,lon:-101.6740,paso:3},
    {id:'MX-023502',cliente:'Mónica Zepeda Rivas',region:'Occidente',ruta:'R-16',marca:'Crédito Mujer',grupo:'Grupo Luz del Alba',lider:'Teresa Bañuelos',montoCredito:10000,adeudoAsig:6400,pagosCapt:1900,saldoReal:4500,diasVenc:41,prob:'Alta',riesgo:'Bajo',ejecutivo:'Verónica Alcalá',jefatura:'Silvia Cordero',estatus:'Con promesa vigente',direccion:'Av. Colón 310, Colima',telefono:'31-2244-7788',aval:'Hugo Rivas',relacionAval:'Esposo',telefonoAval:'31-2244-9900',direccionAval:'Av. Colón 310, Colima',plazo:52,pagoSemanal:200,pagosVencidos:2,pagosLiquidar:49,lat:19.2340,lon:-103.7280,paso:4},
    {id:'MX-023548',cliente:'Rocío Guzmán Peña',region:'Occidente',ruta:'R-16',marca:'Finvivir',grupo:'Grupo Luz del Alba',lider:'Teresa Bañuelos',montoCredito:14000,adeudoAsig:9800,pagosCapt:2600,saldoReal:7200,diasVenc:88,prob:'Media',riesgo:'Medio',ejecutivo:'Verónica Alcalá',jefatura:'Silvia Cordero',estatus:'Liquidado pendiente Core',direccion:'Calle Madero 88, Colima',telefono:'31-2255-3344',aval:'Nidia Peña',relacionAval:'Hermana',telefonoAval:'31-2255-5566',direccionAval:'Calle Madero 90, Colima',plazo:52,pagoSemanal:270,pagosVencidos:6,pagosLiquidar:46,lat:19.2410,lon:-103.7190,paso:6,saldoCore:7200}
  ],
  gestiones:[
    {id:'G-4401',cuentaId:'MX-018245',ejecutivo:'Felipe Ramírez',fecha:'18-ago-2026',tipo:'Pago parcial',monto:1200,folio:'REC-88213',contactoCon:'Titular',obs:'Cliente abona en domicilio. Solicita fraccionar el resto.',estado:'APROBADA',cat:17,validadoPorJefatura:true,validadoPor:'Carmen Vega',fechaValidacion:'20-ago-2026',obsJefatura:'Comprobante revisado. Visita conforme al protocolo.'},
    {id:'G-4402',cuentaId:'MX-020918',ejecutivo:'Felipe Ramírez',fecha:'19-ago-2026',tipo:'Promesa de pago',monto:1500,compromiso:'26-ago-2026',contactoCon:'Titular',obs:'Promete abono tras cobro quincenal.',estado:'APROBADA',cat:17},
    {id:'G-4403',cuentaId:'MX-016880',ejecutivo:'Felipe Ramírez',fecha:'20-ago-2026',tipo:'Sin contacto',motivo:'No localizado',obs:'Domicilio cerrado. Vecina indica que labora fuera.',estado:'APROBADA',cat:17},
    {id:'G-4404',cuentaId:'MX-019004',ejecutivo:'Felipe Ramírez',fecha:'20-ago-2026',tipo:'Pago parcial',monto:900,folio:'REC-88240',obs:'Abono en sucursal. Pendiente de conciliación.',estado:'PENDIENTE',cat:17},
    {id:'G-4405',cuentaId:'MX-022145',ejecutivo:'Felipe Ramírez',fecha:'21-ago-2026',tipo:'Convenio',monto:2300,compromiso:'30-sep-2026',obs:'Convenio a 6 abonos quincenales de $383.',estado:'PENDIENTE',cat:17},
    {id:'G-4406',cuentaId:'MX-020440',ejecutivo:'Ana López',fecha:'19-ago-2026',tipo:'Negativa de pago',motivo:'Negativa expresa',obs:'Titular desconoce el adeudo. Se solicita expediente.',estado:'APROBADA',cat:17}
  ],
  falcos:[
    {id:'F-2201',lider:'María Luna',grupo:'Grupo Las Flores',ruta:'R-04',region:'Jalisco',motivo:'Pago entregado y no aplicado',fecha:'18-jul-2026',tel:'33-1122-4455',adeudo:15400,nCli:9,estatus:'EN_GESTION',repPor:'Diana Soto (Comercial)',ejec:'Felipe Ramírez',fechaAsignacion:'25-jul-2026',domicilioLider:'Calle Morelos 34, Col. Centro, Guadalajara, Jalisco',lat:20.6598,lon:-103.3497,categoriaLider:'Confiable'},
    {id:'F-2198',lider:'Ana Torres',grupo:'Grupo Progreso',ruta:'R-07',region:'Nayarit',motivo:'Robo o pérdida',fecha:'11-ago-2026',tel:'33-6689-2211',adeudo:9800,nCli:6,estatus:'EN_GESTION',repPor:'Diana Soto (Comercial)',ejec:'Felipe Ramírez',fechaAsignacion:'25-ago-2026',domicilioLider:'Av. Insurgentes 22, Tepic, Nayarit',lat:21.5042,lon:-104.8943,categoriaLider:'En observación'},
    {id:'F-2205',lider:'Rosa Bello',grupo:'Grupo Amanecer',ruta:'R-05',region:'Jalisco',motivo:'Diferencia en corte',fecha:'17-ago-2026',tel:'33-4433-1100',adeudo:3200,nCli:4,estatus:'RECIBIDO',repPor:'Diana Soto (Comercial)',ejec:null,domicilioLider:'Calle Juárez 88, Zapopan, Jalisco',lat:20.7215,lon:-103.3919,categoriaLider:'Confiable'},
    {id:'F-2190',lider:'Lucía Ramos',grupo:'Grupo Unión',ruta:'R-11',region:'Colima',motivo:'Uso indebido de recursos',fecha:'02-jul-2026',tel:'33-7711-2244',adeudo:22100,nCli:11,estatus:'ESCALADO',repPor:'Jefatura Comercial Colima',ejec:'Jorge Núñez',fechaAsignacion:'09-jul-2026',domicilioLider:'Calle Reforma 11, Colima',lat:19.2434,lon:-103.7251,categoriaLider:'Riesgo alto'}
  ],
  usuarios:[
    // Jerarquía: Ejecutivo → reportaA (Jefatura) → jefaturaReporta (Gerencia) → gerenciaReporta (Director UdeN) → unidadNegocio (País)
    // Ejecutivo: marcas[] y regiones[] definen su cartera asignada
    {n:'Felipe Ramírez',  c:'felipe.ramirez@finvivir.com', passHash:'3533039341d041af985ecdb42bafdb2d4a59765ca0af4729bd53c68b45636a45',  rol:'Ejecutivo de Recuperación',             pais:'México',  unidadNegocio:'México',    reportaA:'Carmen Vega',  marcas:['Finvivir','Crédito Mujer'],            regiones:['Jalisco','Nayarit'],    estatus:'Activo',   ultimo:'01-sep-2026 08:12', alta:'10-ene-2025', intentosFallidos:0, mfa:true,  passVence:'10-nov-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Mariana Ríos',    c:'mariana.rios@finvivir.com', passHash:'0985b2e0a3a262b9db335487a01707bbcb04d2b41217ac7d9db4fdcf742b8180',    rol:'Ejecutivo de Recuperación',             pais:'México',  unidadNegocio:'México',    reportaA:'Carmen Vega',  marcas:['Finvivir'],                            regiones:['Jalisco'],              estatus:'Activo',   ultimo:'01-sep-2026 07:58', alta:'15-feb-2025', intentosFallidos:0, mfa:true,  passVence:'15-dic-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Jorge Núñez',     c:'jorge.nunez@finvivir.com', passHash:'b7e52b0908757141a44e50ed53b6050d78f6004102c190160dcbe020278397b7',     rol:'Ejecutivo de Recuperación',             pais:'México',  unidadNegocio:'México',    reportaA:'Paola Vega',   marcas:['Finvivir','Crédito Semilla','Crédito Mujer'], regiones:['Colima'],              estatus:'Activo',   ultimo:'31-ago-2026 18:40', alta:'03-mar-2025', intentosFallidos:2, mfa:false, passVence:'03-dic-2026', ipUltimo:'201.174.xx.xx', sesionesActivas:0},
    {n:'Ana López',       c:'ana.lopez@finvivir.com', passHash:'779e18d8ae622a909ddbecb3d074f5ea6a11a411c3259085d0b7a695861a0adf',       rol:'Ejecutivo de Recuperación',             pais:'México',  unidadNegocio:'México',    reportaA:'Carmen Vega',  marcas:['Crédito Mujer','Finvivir'],            regiones:['Jalisco','Nayarit'],              estatus:'Activo',   ultimo:'01-sep-2026 08:30', alta:'05-jun-2025', intentosFallidos:0, mfa:false, passVence:'05-dic-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Rodrigo Salas',   c:'rodrigo.salas@finvivir.com', passHash:'2ccfe69851a7ca5c2d7f8d9fc08a77ef917b9a68f366b162a977144dd1912345',   rol:'Ejecutivo de Recuperación',             pais:'México',  unidadNegocio:'México',    reportaA:'Carmen Vega',  marcas:['Finvivir','Crédito Mujer'],            regiones:['Nayarit'],              estatus:'Bloqueado',ultimo:'02-ago-2026 11:05', alta:'12-jun-2024', intentosFallidos:5, mfa:false, passVence:'12-sep-2026', ipUltimo:'189.240.xx.xx', sesionesActivas:0, motivoBaja:'Baja temporal por incapacidad médica. Ticket RH-4408.'},
    {n:'Claudia Bermúdez',c:'claudia.bermudez@finvivir.com', passHash:'88b2e1216504bd1124f8c67055cc8f0281eadcccb9857566aa9bdebc34591b71',rol:'Ejecutivo de Recuperación',             pais:'México',  unidadNegocio:'México',    reportaA:'Carmen Vega',  marcas:['Finvivir','Crédito Negocio'],          regiones:['Jalisco','Nayarit'],    estatus:'Activo',   ultimo:'01-sep-2026 07:45', alta:'08-ago-2025', intentosFallidos:1, mfa:false, passVence:'08-feb-2027', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Carmen Vega',     c:'carmen.vega@finvivir.com', passHash:'b0feb4cb2b07a5172f3a941e2d87d8ae2317d7d35144a8e0f6ad604b33462e4b',     rol:'Jefatura de Recuperación',              pais:'México',  unidadNegocio:'México',    reportaA:'Laura Méndez', marcas:['Finvivir','Crédito Mujer','Crédito Negocio'], regiones:['Jalisco','Nayarit'], estatus:'Activo',   ultimo:'01-sep-2026 08:45', alta:'05-ene-2023', intentosFallidos:0, mfa:true,  passVence:'05-nov-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Paola Vega',      c:'paola.vega@finvivir.com', passHash:'4b3659cb282b4a8bdcaef4bd99d689fc217af90fdf8c82c9cf1b792041164c6c',      rol:'Jefatura de Recuperación',              pais:'México',  unidadNegocio:'México',    reportaA:'Laura Méndez', marcas:['Finvivir','Crédito Semilla'],          regiones:['Colima'],              estatus:'Activo',   ultimo:'01-sep-2026 08:00', alta:'10-ene-2023', intentosFallidos:0, mfa:true,  passVence:'10-nov-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Héctor Lomelí',   c:'hector.lomeli@finvivir.com', passHash:'a6746c6ae8093b0580339976a67de5d66f46ccc576b9a6f01640fee19941184c',   rol:'Jefatura de Recuperación',              pais:'México',  unidadNegocio:'México',    reportaA:'Laura Méndez', marcas:['Finvivir','Crédito Negocio'],          regiones:['Bajío'],               estatus:'Activo',   ultimo:'01-sep-2026 08:20', alta:'12-feb-2023', intentosFallidos:0, mfa:true,  passVence:'12-dic-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Silvia Cordero',  c:'silvia.cordero@finvivir.com', passHash:'be384058810569b8dfd2fd5bae6dba238f49882ff579a82191ac705f892f837a',  rol:'Jefatura de Recuperación',              pais:'México',  unidadNegocio:'México',    reportaA:'Laura Méndez', marcas:['Finvivir','Crédito Mujer'],            regiones:['Occidente'],           estatus:'Activo',   ultimo:'01-sep-2026 08:35', alta:'20-feb-2023', intentosFallidos:0, mfa:true,  passVence:'20-dic-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Ignacio Beltrán', c:'ignacio.beltran@finvivir.com', passHash:'5af01e439688d05fd4135b6bfb259812cfc558e451e716da83d3c7361ae08021', rol:'Ejecutivo de Recuperación',             pais:'México',  unidadNegocio:'México',    reportaA:'Héctor Lomelí',marcas:['Finvivir','Crédito Negocio'],          regiones:['Bajío'],               estatus:'Activo',   ultimo:'01-sep-2026 07:50', alta:'05-may-2025', intentosFallidos:0, mfa:false, passVence:'05-ene-2027', ipUltimo:'189.240.xx.xx', sesionesActivas:1},
    {n:'Verónica Alcalá', c:'veronica.alcala@finvivir.com', passHash:'395c3b7d99d5d5af6a406c38cffd4f0f234c33748bf4d6ef0c545b851921fde6', rol:'Ejecutivo de Recuperación',             pais:'México',  unidadNegocio:'México',    reportaA:'Silvia Cordero',marcas:['Finvivir','Crédito Mujer'],           regiones:['Occidente'],           estatus:'Activo',   ultimo:'01-sep-2026 08:05', alta:'18-jun-2025', intentosFallidos:0, mfa:false, passVence:'18-feb-2027', ipUltimo:'189.240.xx.xx', sesionesActivas:1},
    {n:'Laura Méndez',    c:'laura.mendez@finvivir.com', passHash:'91a34a861009b0b420ae724c4640cf1ebf87bc7ea9cdf1fdaa276319c10955df',    rol:'Gerencia de Recuperación',              pais:'México',  unidadNegocio:'México',    reportaA:'Roberto Ávila',marcas:[], regiones:['Jalisco','Nayarit','Colima','Bajío','Occidente'], estatus:'Activo',   ultimo:'01-sep-2026 09:20', alta:'01-ene-2023', intentosFallidos:0, mfa:true,  passVence:'01-nov-2026', ipUltimo:'201.174.xx.xx', sesionesActivas:1},
    {n:'Roberto Ávila',   c:'r.avila@finvivir.com', passHash:'01e66343eb938cada6ce30f3054a44e8c3d4565174a28916dbda7ba41a661c9d',         rol:'Director de Unidad de Negocio',         pais:'México',  unidadNegocio:'México',    reportaA:null,           marcas:[], regiones:[],                          estatus:'Activo',   ultimo:'01-sep-2026 10:00', alta:'01-ene-2023', intentosFallidos:0, mfa:true,  passVence:'01-nov-2026', ipUltimo:'201.174.xx.xx', sesionesActivas:1},
    {n:'Diana Soto',      c:'diana.soto@finvivir.com', passHash:'feb14ea9ac8804397051c0666c754d82ce2e2b62d14f38fab5d6364967c32a50',      rol:'Jefatura Comercial',                    pais:'México',  unidadNegocio:'México',    reportaA:'Laura Méndez', marcas:['Finvivir','Crédito Mujer'],            regiones:['Jalisco'],              estatus:'Activo',   ultimo:'31-ago-2026 16:11', alta:'20-abr-2024', intentosFallidos:0, mfa:true,  passVence:'20-dic-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:0},
    {n:'Patricia Morales',c:'p.morales@finvivir.com', passHash:'7d396efd719dc3eff51099aa394624028abfefc45e8c6a42df2823a318f24ae5',       rol:'Especialista de Información y Control', pais:'México',  unidadNegocio:'México',    reportaA:'Laura Méndez', marcas:[], regiones:['Jalisco','Nayarit','Colima'], estatus:'Activo',   ultimo:'01-sep-2026 09:45', alta:'10-mar-2024', intentosFallidos:0, mfa:true,  passVence:'10-dic-2026', ipUltimo:'187.152.xx.xx', sesionesActivas:1},
    {n:'Sofía Admin',     c:'sofia.admin@finvivir.com', passHash:'db17d04f665c28c46ed2ffe428dc692fd4ef6701eb6e9eaa89132ec49a2486fa',     rol:'Administrador de Seguridad',            pais:'Global',  unidadNegocio:'Global',    reportaA:null,           marcas:[], regiones:[],                          estatus:'Activo',   ultimo:'01-sep-2026 10:30', alta:'01-ene-2023', intentosFallidos:0, mfa:true,  passVence:'01-nov-2026', ipUltimo:'201.174.xx.xx', sesionesActivas:1},
    {n:'Marco Dev',       c:'marco.dev@finvivir.com', passHash:'bef7ff73664e6dd9bec43447f057891781bd77cb1e0860bf1498499b5fccbb29',       rol:'Administrador de Configuración',        pais:'Global',  unidadNegocio:'Global',    reportaA:null,           marcas:[], regiones:[],                          estatus:'Activo',   ultimo:'01-sep-2026 09:00', alta:'01-ene-2023', intentosFallidos:0, mfa:true,  passVence:'01-nov-2026', ipUltimo:'201.174.xx.xx', sesionesActivas:1},
  ],
  ejecutivos:[
    {n:'Felipe Ramírez',meta:9000,recuperado:5420,prev:[52,58,61,55,63,60]},
    {n:'Mariana Ríos',meta:9000,recuperado:7830,prev:[71,74,79,81,84,87]},
    {n:'Jorge Núñez',meta:8000,recuperado:2610,prev:[48,44,41,38,36,33]},
    {n:'Ana López',meta:7500,recuperado:6100,prev:[68,72,75,77,79,81]},
    {n:'Rodrigo Salas',meta:8500,recuperado:4930,prev:[55,57,54,59,58,58]},
    {n:'Claudia Bermúdez',meta:9000,recuperado:8460,prev:[80,85,88,91,93,94]},
    {n:'Ignacio Beltrán',meta:8500,recuperado:6300,prev:[62,66,69,72,74,76]},
    {n:'Verónica Alcalá',meta:9500,recuperado:7900,prev:[70,72,74,76,78,79]}
  ],
  jefaturas:[
    {n:'Carmen Vega',region:'Jalisco / Nayarit',meta:51000,recuperado:35350,prev:[59,62,66,68,70,69]},
    {n:'Paola Vega',region:'Colima',meta:38000,recuperado:19400,prev:[54,52,50,49,51,51]},
    {n:'Héctor Lomelí',region:'Bajío',meta:44000,recuperado:33900,prev:[64,68,71,74,76,77]},
    {n:'Silvia Cordero',region:'Occidente',meta:47000,recuperado:36200,prev:[70,71,73,75,76,77]}
  ],
  /* Esta instancia del sistema opera para un único país (una instancia = un país = una moneda).
     Los demás países de Grupo Finvivir operan cada uno su propia instancia independiente. */
  paises:[
    {p:'México',meta:180000,recuperado:124850,par30:8.4,par90:5.1,quebranto:2.3},
  ],
  dictaminaciones:[
    {id:'D-001',cuentaId:'MX-017733',cliente:'Elena Díaz Mora',ejecutivo:'Felipe Ramírez',
     fecha:'16-ago-2026',resolucion:'Ilocalizable',hallazgos:'Sin pagos desde el desembolso. Domicilio verificado inaccesible en 3 visitas. Aval con teléfono fuera de servicio.',
     estado:'PENDIENTE_VOBO',rechazadoPor:null,motivoRechazo:null},
    {id:'D-002',cuentaId:'MX-015002',cliente:'Guadalupe Ríos Tapia',ejecutivo:'Ana López',
     fecha:'18-ago-2026',resolucion:'Irrecuperable',hallazgos:'388 días de vencimiento. Sin contacto tras 12 visitas documentadas.',
     estado:'PENDIENTE_VOBO',rechazadoPor:null,motivoRechazo:null},
    {id:'D-003',cuentaId:'MX-018991',cliente:'Alicia Mendoza Rojas',ejecutivo:'Jorge Núñez',
     fecha:'14-ago-2026',resolucion:'Fraude',hallazgos:'Domicilio falso confirmado por verificación en campo. 229 días sin pago. Posible identidad alterada.',
     estado:'VOBO_JEFATURA',rechazadoPor:null,motivoRechazo:null},
    {id:'D-004',cuentaId:'MX-020440',cliente:'Beatriz Campos Ruelas',ejecutivo:'Ana López',
     fecha:'10-ago-2026',resolucion:'Negativa de pago',hallazgos:'Titular niega adeudo y se rehúsa a recibir al ejecutivo. Negocio propio activo — tiene solvencia.',
     estado:'RECHAZADA_JEFATURA',rechazadoPor:'Carmen Vega',motivoRechazo:'Se requieren 2 visitas documentadas adicionales y verificación del expediente de originación.'}
  ],
  
  bitacora:[
    {ts:'21-ago-2026 08:14',quien:'Carmen Vega',rol:'Jefatura de Recuperación',accion:'Asignación de cartera',detalle:'Por grupo · 4 cuenta(s) → Mariana Ríos',motivo:'Concentración de ruta R-04 para reducir traslados en la zona centro.',antes:'—',despues:'4 cuentas'},
    {ts:'21-ago-2026 07:52',quien:'Sistema',rol:'Proceso automático',accion:'Apertura de catorcena',detalle:'Catorcena 17 · 2026',motivo:'Generación automática del calendario anual.',antes:'PROGRAMADA',despues:'ABIERTA'},
    {ts:'20-ago-2026 18:31',quien:'Carmen Vega',rol:'Jefatura de Recuperación',accion:'Rechazo de gestión',detalle:'G-4398 · Pago parcial · MX-021077',motivo:'El folio REC-88102 no aparece en la conciliación bancaria del día.',antes:'PENDIENTE',despues:'RECHAZADA'},
    {ts:'20-ago-2026 16:05',quien:'Marco Dev',rol:'Administrador de Configuración',accion:'Cambio de parámetro',detalle:'MAX_CUENTAS_POR_EJECUTIVO',motivo:'Ajuste de carga operativa autorizado por Gerencia el 19-ago-2026.',antes:'45',despues:'50'},
    {ts:'20-ago-2026 11:20',quien:'Sofía Admin',rol:'Administrador de Seguridad',accion:'Bloqueo de usuario',detalle:'Rodrigo Salas',motivo:'Baja temporal por incapacidad médica. Ticket RH-4408.',antes:'Activo',despues:'Bloqueado'},
    {ts:'19-ago-2026 15:47',quien:'Ana López',rol:'Ejecutivo de Recuperación',accion:'Dictaminación',detalle:'MX-018991 · Alicia Mendoza Rojas · resolución Propuesta de dictaminación',motivo:'Sin pagos desde el desembolso, sin aval identificado y domicilio verificado como inexistente en dos visitas.',antes:'En gestión',despues:'Dictaminación propuesta'},
    {ts:'19-ago-2026 10:12',quien:'Laura Méndez',rol:'Gerencia de Recuperación',accion:'Resolución de escalación',detalle:'E-298 · Solicitud de ampliación de plazo de convenio',motivo:'Se autoriza ampliación a 8 abonos para 4 casos de Nayarit con seguimiento quincenal.',antes:'PENDIENTE',despues:'RESUELTA'},
    {ts:'18-ago-2026 09:38',quien:'Diana Soto',rol:'Jefatura Comercial',accion:'Reporte de FALCO',detalle:'F-2201 · María Luna · Grupo Las Flores · $15,400',motivo:'La líder reporta que entregó el corte y no se refleja aplicado en las cuentas del grupo.',antes:'—',despues:'RECIBIDO'},
    {ts:'17-ago-2026 14:22',quien:'Marco Dev',rol:'Administrador de Configuración',accion:'Modificación de catálogo',detalle:'MOTIVO_FALCO · alta de «Diferencia en corte»',motivo:'Supuesto operativo recurrente detectado en las rutas de Colima.',antes:'4 valores',despues:'5 valores'},
    {ts:'15-ago-2026 12:00',quien:'Sistema',rol:'Proceso automático',accion:'Cierre de catorcena',detalle:'Catorcena 16 · 2026 · logro promedio 58.0%',motivo:'Cierre automático el día 14 a las 23:59:59.',antes:'ABIERTA',despues:'CERRADA'},
    {ts:'19-ago-2026 11:30',quien:'Marco Dev',rol:'Administrador de Configuración',accion:'Cambio de parámetro',detalle:'META_CATORCENAL',motivo:'Ajuste por lineamiento trimestral. Autorizado en reunión de dirección del 18-ago-2026.',antes:'8500',despues:'9000'},
    {ts:'29-jul-2026 09:15',quien:'Marco Dev',rol:'Administrador de Configuración',accion:'Override de catorcena',detalle:'Catorcena 15 · nueva duración 16 días',motivo:'Semana Santa: ampliación por instrucción de dirección regional.',antes:'14 días',despues:'16 días'},
    {ts:'18-jul-2026 15:40',quien:'Sistema',rol:'Proceso automático',accion:'Cierre de catorcena',detalle:'Catorcena 15 · 2026 · logro promedio 72.3%',motivo:'Cierre automático el día 16 a las 23:59:59.',antes:'ABIERTA',despues:'CERRADA'},
    {ts:'10-jul-2026 10:05',quien:'Marco Dev',rol:'Administrador de Configuración',accion:'Modificación de catálogo',detalle:'TIPO_GESTION · alta de «Visita notarial»',motivo:'Nuevos casos que requieren acompañamiento legal. Autorizado por Gerencia Jurídica.',antes:'8 valores',despues:'9 valores'},
    {ts:'05-jun-2026 14:10',quien:'Marco Dev',rol:'Administrador de Configuración',accion:'Reversión de parámetro',detalle:'DIAS_MORA_ESCALACION',motivo:'Rollback solicitado por Gerencia de Recuperación: el cambio anterior afectó la escalación de casos en curso.',antes:'150',despues:'180'},
    {ts:'02-jun-2026 08:00',quien:'Sistema',rol:'Proceso automático',accion:'Apertura de catorcena',detalle:'Catorcena 12 · 2026',motivo:'Generación automática del calendario anual.',antes:'PROGRAMADA',despues:'ABIERTA'},
    {ts:'18-may-2026 12:00',quien:'Sistema',rol:'Proceso automático',accion:'Cierre de catorcena',detalle:'Catorcena 11 · 2026 · logro promedio 68.1%',motivo:'Cierre automático el día 14 a las 23:59:59.',antes:'ABIERTA',despues:'CERRADA'},
    {ts:'01-sep-2026 07:12',quien:'Sistema',rol:'Proceso automático',accion:'Alerta de seguridad',detalle:'Jorge Núñez — 2 intentos fallidos de acceso desde IP 201.174.xx.xx',motivo:'Detección automática de intentos fallidos consecutivos.',antes:'0 intentos',despues:'2 intentos'},
    {ts:'31-ago-2026 22:45',quien:'Sistema',rol:'Proceso automático',accion:'Bloqueo de usuario',detalle:'Rodrigo Salas — cuenta bloqueada por inactividad >30 días',motivo:'Política automática de bloqueo por inactividad.',antes:'Activo',despues:'Bloqueado'},
    {ts:'28-ago-2026 10:20',quien:'Sofía Admin',rol:'Administrador de Seguridad',accion:'Alta de usuario',detalle:'Claudia Bermúdez · Ejecutivo de Recuperación · Jalisco, Nayarit',motivo:'Ingreso de nueva ejecutiva según nómina. Ticket RH-4491 aprobado por Carmen Vega el 25-ago-2026.',antes:null,despues:'Activo'},
    {ts:'15-ago-2026 09:00',quien:'Sofía Admin',rol:'Administrador de Seguridad',accion:'Modificación de usuario',detalle:'Laura Méndez — MFA activado obligatoriamente',motivo:'Activación de MFA conforme a nueva política de seguridad para perfiles gerenciales. Circular DIR-0089.',antes:'Perfil: Gerencia / México / MFA: No',despues:'Perfil: Gerencia / México / MFA: Sí'},
    {ts:'10-ago-2026 14:30',quien:'Sofía Admin',rol:'Administrador de Seguridad',accion:'Cierre de sesión forzado',detalle:'Felipe Ramírez — sesión desde IP desconocida',motivo:'IP de acceso fuera del rango habitual. Se cerró sesión preventivamente y se notificó al usuario.',antes:'1 sesión activa',despues:'0 sesiones'},
    {ts:'05-ago-2026 16:00',quien:'Sofía Admin',rol:'Administrador de Seguridad',accion:'Reseteo de intentos fallidos',detalle:'Jorge Núñez — 3 intentos fallidos reseteados',motivo:'Usuario verificó identidad vía videollamada supervisada. Ticket SEG-1041.',antes:'3 intentos',despues:'0 intentos'},
    {ts:'01-ago-2026 08:30',quien:'Sistema',rol:'Proceso automático',accion:'Alerta de seguridad',detalle:'Acceso desde nueva IP detectado — Roberto Ávila',motivo:'Primer acceso desde 201.174.xx.xx. IP registrada automáticamente.',antes:'IP anterior',despues:'IP actualizada'},
  ],
  agenda:[
    {ejecutivo:'Felipe Ramírez',grupo:'Grupo Las Flores', semana:'2026-08-10',dia:1,hora:'09:00',hecha:true},
    {ejecutivo:'Felipe Ramírez',grupo:'Grupo Progreso',   semana:'2026-08-10',dia:2,hora:'08:30',hecha:true},
    {ejecutivo:'Felipe Ramírez',grupo:'Grupo Amanecer',   semana:'2026-08-10',dia:4,hora:'10:00',hecha:true},
    {ejecutivo:'Felipe Ramírez',grupo:'Grupo Las Flores', semana:'2026-08-17',dia:1,hora:'09:00',hecha:true},
    {ejecutivo:'Felipe Ramírez',grupo:'Grupo Amanecer',   semana:'2026-08-17',dia:3,hora:'10:30',hecha:true},
    {ejecutivo:'Felipe Ramírez',grupo:'Grupo Progreso',   semana:'2026-08-17',dia:6,hora:'09:00',hecha:false},
    {ejecutivo:'Felipe Ramírez',grupo:'Grupo Esperanza',  semana:'2026-08-24',dia:2,hora:'11:00',hecha:false},
    {ejecutivo:'Felipe Ramírez',grupo:'Grupo Las Flores', semana:'2026-08-24',dia:4,hora:'09:00',hecha:false},
    {ejecutivo:'Ana López',     grupo:'Grupo Esperanza',  semana:'2026-08-17',dia:1,hora:'08:00',hecha:true},
    {ejecutivo:'Ana López',     grupo:'Grupo Horizonte',  semana:'2026-08-17',dia:3,hora:'09:30',hecha:true},
    {ejecutivo:'Ana López',     grupo:'Grupo Esperanza',  semana:'2026-08-24',dia:1,hora:'08:00',hecha:false},
    {ejecutivo:'Ana López',     grupo:'Grupo Horizonte',  semana:'2026-08-24',dia:4,hora:'10:00',hecha:false},
    {ejecutivo:'Jorge Núñez',   grupo:'Grupo Unión',      semana:'2026-08-17',dia:2,hora:'09:00',hecha:true},
    {ejecutivo:'Jorge Núñez',   grupo:'Grupo Horizonte',  semana:'2026-08-17',dia:5,hora:'10:00',hecha:false},
    {ejecutivo:'Jorge Núñez',   grupo:'Grupo Unión',      semana:'2026-08-24',dia:2,hora:'09:00',hecha:false},
    {ejecutivo:'Mariana Ríos',  grupo:'Grupo Progreso Sur',semana:'2026-08-17',dia:3,hora:'11:00',hecha:true},
    {ejecutivo:'Mariana Ríos',  grupo:'Grupo Progreso Sur',semana:'2026-08-24',dia:3,hora:'11:00',hecha:false},
    {ejecutivo:'Claudia Bermúdez',grupo:'Grupo Solidario Norte',semana:'2026-08-17',dia:4,hora:'09:00',hecha:true},
    {ejecutivo:'Claudia Bermúdez',grupo:'Grupo Solidario Norte',semana:'2026-08-24',dia:4,hora:'09:00',hecha:false},
    {ejecutivo:'Rodrigo Salas', grupo:'Grupo Norte',      semana:'2026-08-17',dia:1,hora:'08:30',hecha:false},
    {ejecutivo:'Rodrigo Salas', grupo:'Grupo Norte',      semana:'2026-08-24',dia:1,hora:'08:30',hecha:false},
    {id:'G-4510',cuentaId:'MX-017733',ejecutivo:'Felipe Ramírez',fecha:'16-ago-2026',tipo:'Sin contacto',obs:'Domicilio vacío. Vecinos reportan salida definitiva.',contactoCon:'Referencia familiar',estado:'APROBADA',cat:17},
    {id:'G-4511',cuentaId:'MX-020918',ejecutivo:'Ana López',fecha:'15-ago-2026',tipo:'Pago parcial',monto:800,folio:'REC-88099',obs:'Abono realizado por el aval en nombre de la titular.',contactoCon:'Aval',estado:'APROBADA',cat:16}
  ],
  /* Comportamiento semanal del ejecutivo. En producción se calcula desde bitácora y pagos. */
  /* Comportamiento semanal del ejecutivo. En producción se calcula desde bitácora y pagos. */
  semanas:[
    {ini:'2026-05-25',cat:11,sc:1,cuentas:14,pagos:10,clientes: 8,rec:3900},
    {ini:'2026-06-01',cat:11,sc:2,cuentas:18,pagos:13,clientes:11,rec:4700},
    {ini:'2026-06-08',cat:12,sc:1,cuentas:17,pagos:12,clientes:10,rec:4550},
    {ini:'2026-06-15',cat:12,sc:2,cuentas:12,pagos: 8,clientes: 7,rec:3200},
    {ini:'2026-06-22',cat:13,sc:1,cuentas:19,pagos:13,clientes:11,rec:4800},
    {ini:'2026-06-29',cat:13,sc:2,cuentas:21,pagos:15,clientes:12,rec:5100},
    {ini:'2026-07-06',cat:14,sc:1,cuentas:11,pagos: 7,clientes: 6,rec:2900},
    {ini:'2026-07-13',cat:14,sc:2,cuentas:16,pagos:12,clientes:10,rec:4400},
    {ini:'2026-07-20',cat:15,sc:1,cuentas:18,pagos:13,clientes:11,rec:4600},
    {ini:'2026-07-27',cat:15,sc:2,cuentas:13,pagos: 9,clientes: 8,rec:3500},
    {ini:'2026-08-03',cat:16,sc:1,cuentas: 9,pagos: 6,clientes: 5,rec:2400},
    {ini:'2026-08-10',cat:16,sc:2,cuentas:20,pagos:14,clientes:12,rec:4900},
    {ini:'2026-08-13',cat:17,sc:1,cuentas:15,pagos: 8,clientes: 7,rec:3120},
    {ini:'2026-08-20',cat:17,sc:2,cuentas: 7,pagos: 4,clientes: 4,rec:2300},
    {ini:'2026-08-27',cat:18,sc:1,cuentas:11,pagos: 7,clientes: 6,rec:2850}
  ],
  notificaciones:[
    {id:'N-001',tipo:'asignacion',icono:'📥',titulo:'2 cuentas nuevas asignadas a tu gestión',
     detalle:'Se agregaron MX-021512 (Yolanda Estrada Vidal · $3,900) y MX-019887 (Teresa Valdez Nuño · $6,200) a tu cartera.',
     fecha:'21-ago-2026',hora:'08:02',leida:false,accion:{vista:'miCartera'}},
    {id:'N-002',tipo:'falco',icono:'📮',titulo:'FALCO asignado — Prioriza su atención',
     detalle:'Se te asignó el FALCO F-2198 del Grupo Progreso (Líder Ana Torres, Nayarit). Monto involucrado: $9,800 · 6 clientes afectados.',
     fecha:'21-ago-2026',hora:'07:55',leida:false,accion:{vista:'detalle',arg:'F-2198'}},
    {id:'N-003',tipo:'falco',icono:'📮',titulo:'FALCO asignado — Prioriza su atención',
     detalle:'Se te asignó el FALCO F-2201 del Grupo Las Flores (Líder María Luna, Jalisco). Monto involucrado: $15,400 · 9 clientes afectados.',
     fecha:'18-ago-2026',hora:'09:41',leida:false,accion:{vista:'detalle',arg:'F-2201'}},
    {id:'N-004',tipo:'retiro',icono:'📤',titulo:'1 cuenta retirada de tu gestión',
     detalle:'MX-021077 (Norma Aguilar Sosa) fue reasignada a otro ejecutivo. Se redujo tu saldo asignado en $6,000.',
     fecha:'17-ago-2026',hora:'16:30',leida:true,accion:{vista:'miCartera'}},
    {id:'N-005',tipo:'dictamen',icono:'⚖️',titulo:'Dictaminación rechazada — MX-017733',
     detalle:'La propuesta de dictaminación de Elena Díaz Mora fue rechazada por Jefatura. Motivo: se requieren 2 visitas adicionales documentadas antes de escalar.',
     fecha:'16-ago-2026',hora:'14:15',leida:true,accion:{vista:'detalle',arg:'MX-017733'}},
    {id:'N-006',tipo:'asignacion',icono:'📥',titulo:'5 cuentas asignadas al inicio de la catorcena',
     detalle:'Al abrir la catorcena 17 se incorporaron a tu cartera: MX-016455, MX-017204, MX-018106, MX-019004 y MX-022145.',
     fecha:'13-ago-2026',hora:'00:01',leida:true,accion:{vista:'miCartera'}},
    {id:'N-007',tipo:'dictamen',icono:'⚖️',titulo:'Dictaminación en revisión — MX-020918',
     detalle:'Tu propuesta de dictaminación para Marta Gómez Ruiz está siendo revisada por Jefatura. Te notificaremos cuando haya resolución.',
     fecha:'12-ago-2026',hora:'11:20',leida:true,accion:{vista:'detalle',arg:'MX-020918'}},
    {id:'N-008',tipo:'asignacion',icono:'📥',titulo:'3 cuentas asignadas',
     detalle:'MX-018245 (Juana Pérez López · $8,450), MX-016880 (Patricia Solís Vega · $15,600) y MX-017733 (Elena Díaz Mora · $12,300) ingresaron a tu cartera.',
     fecha:'30-jul-2026',hora:'08:00',leida:true,accion:{vista:'miCartera'}},
    {id:'NJ-001',tipo:'dictamen',icono:'⚖️',rol:'jefatura',titulo:'2 dictaminaciones esperando tu VoBo',
     detalle:'Elena Díaz Mora (MX-017733) y Guadalupe Ríos Tapia (MX-015002) tienen propuesta de dictaminación pendiente de tu firma de autorización para pasar a Gerencia.',
     fecha:'21-ago-2026',hora:'09:00',leida:false,accion:{vista:'dictJefe'}},
    {id:'NJ-002',tipo:'asignacion',icono:'📥',rol:'jefatura',titulo:'1 FALCO sin ejecutivo asignado',
     detalle:'F-2205 (Grupo Amanecer · Rosa Bello · $3,200) lleva más de una semana sin asignar. Requiere ejecutivo.',
     fecha:'21-ago-2026',hora:'08:45',leida:false,accion:{vista:'falcoAsig'}},
    {id:'NJ-003',tipo:'alerta',icono:'🚨',rol:'jefatura',titulo:'Jorge Núñez en logro crítico (33%)',
     detalle:'Ha recuperado $2,610 de $8,000. Considera redistribuir cartera o programar acompañamiento en campo.',
     fecha:'20-ago-2026',hora:'17:00',leida:true,accion:{vista:'carteraEquipo'}},
    {id:'NG-001',tipo:'dictamen',icono:'⚖️',rol:'gerencia',titulo:'1 dictaminación con VoBo de Jefatura — requiere tu aprobación final',
     detalle:'Alicia Mendoza Rojas (MX-018991) tiene el VoBo de Carmen Vega y espera tu resolución final para quedar oficialmente dictaminada.',
     fecha:'21-ago-2026',hora:'09:15',leida:false,accion:{vista:'dictGer'}},
    {id:'NG-002',tipo:'alerta',icono:'📊',rol:'gerencia',titulo:'Logro del equipo al 69.3% con 5 días para el cierre',
     detalle:'Al ritmo actual el equipo cerraría en 107.8%. Sin embargo, Jorge Núñez está en 33% y representa riesgo para la meta del área.',
     fecha:'21-ago-2026',hora:'08:00',leida:false,accion:{vista:'tabGer'}},
    {id:'NG-003',tipo:'alerta',icono:'📋',rol:'gerencia',titulo:'Baja cobertura en Ruta R-08',
     detalle:'62 cuentas sin gestión activa en la última semana. Revisar en Cartera de Jefaturas y redistribuir.',
     fecha:'15-ago-2026',hora:'10:00',leida:true,accion:{vista:'carterasGer'}}
  ],
  conciliacion:[
    {id:'C-001',cuentaId:'MX-018245',cliente:'Juana Pérez López',ejecutivo:'Felipe Ramírez',
     folioCampo:'REC-88213',montoCampo:1200,folioCore:'REC-88213',montoCore:1200,
     fecha:'18-ago-2026',estado:'Conciliado',diferencia:0},
    {id:'C-002',cuentaId:'MX-020918',cliente:'Marta Gómez Ruiz',ejecutivo:'Felipe Ramírez',
     folioCampo:'REC-88240',montoCampo:900,folioCore:null,montoCore:0,
     fecha:'20-ago-2026',estado:'Pendiente de conciliación',diferencia:900,
     alerta:'Pago capturado en campo no aparece aplicado en el Core'},
    {id:'C-003',cuentaId:'MX-016880',cliente:'Patricia Solís Vega',ejecutivo:'Felipe Ramírez',
     folioCampo:'REC-88101',montoCampo:2500,folioCore:'REC-88101',montoCore:2000,
     fecha:'17-ago-2026',estado:'Diferencia de monto',diferencia:500,
     alerta:'El monto en campo ($2,500) difiere del aplicado en Core ($2,000)'},
    {id:'C-004',cuentaId:'MX-019004',cliente:'Sofía Herrera Cruz',ejecutivo:'Ana López',
     folioCampo:'REC-88315',montoCampo:1800,folioCore:'REC-88315',montoCore:1800,
     fecha:'19-ago-2026',estado:'Conciliado',diferencia:0},
    {id:'C-005',cuentaId:'MX-022145',cliente:'Lucía Navarro Peña',ejecutivo:'Ana López',
     folioCampo:'REC-88320',montoCampo:750,folioCore:null,montoCore:0,
     fecha:'21-ago-2026',estado:'Pendiente de conciliación',diferencia:750,
     alerta:'Folio sin registro en Core. Verificar con ejecutivo.'}
  ],
  catorcenaActual:17, /* Calculado automáticamente al iniciar — ver inicializarCalendario() */
};

/* Catorcenas del año: generadas automáticamente (Opción C — Híbrida Automática) */
function generarCatorcenas(anio){
  const out=[]; let ini=new Date(anio,0,1);
  const _sf=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
  const hoyMs=_sf(HOY).getTime();
  for(let i=0;i<26;i++){
    const a=new Date(ini);
    const b=new Date(ini); b.setDate(b.getDate()+P('DURACION_CATORCENA')-1);
    // Estado calculado automáticamente por fecha real
    const inicioMs=_sf(a).getTime();
    const finMs=_sf(b).getTime();
    let estado;
    if(finMs<hoyMs)         estado='CERRADA';
    else if(inicioMs<=hoyMs) estado='ABIERTA';
    else                     estado='PROGRAMADA';
    out.push({num:i+1,anio,inicio:new Date(a),fin:new Date(b),estado,override:null});
    ini.setDate(ini.getDate()+P('DURACION_CATORCENA'));
  }
  return out;
}
/* Recalcular catorcenaActual a partir del calendario generado */
function recalcularCatorcenaActual(catorcenas){
  const act=catorcenas.find(c=>c.estado==='ABIERTA');
  return act?act.num:catorcenas.filter(c=>c.estado==='CERRADA').length;
}
/* ── Inicialización del calendario multi-año ─────────────────────────
   El sistema mantiene un histórico de catorcenas por año.
   Al cruzar el año, genera el nuevo calendario y archiva el anterior.
   DB.catorcenasPorAnio guarda todos los años para navegación histórica.
   ──────────────────────────────────────────────────────────────────── */
function inicializarCalendario(){
  const anioActual=HOY.getFullYear();
  // Generar catorcenas para el año actual
  const catsActual=generarCatorcenas(anioActual);
  DB.catorcenas=catsActual;

  // Si el prototipo arranca en un año diferente a 2026, generar 2026 también
  // para preservar el histórico de registros que referencian catorcenas de 2026
  if(!DB.catorcenasPorAnio) DB.catorcenasPorAnio={};
  if(anioActual!==2026){
    DB.catorcenasPorAnio[2026]=DB.catorcenasPorAnio[2026]||generarCatorcenas(2026);
    // Marcar todas las de 2026 como CERRADA (año pasado)
    DB.catorcenasPorAnio[2026].forEach(c=>{ if(c.estado!=='CERRADA') c.estado='CERRADA'; });
  }
  DB.catorcenasPorAnio[anioActual]=catsActual;

  // Calcular catorcenaActual desde el calendario
  DB.catorcenaActual=recalcularCatorcenaActual(catsActual);
}
inicializarCalendario();

/* ══════════════════════════════════════════════════════════════════
   4. REGLAS DE NEGOCIO
   ══════════════════════════════════════════════════════════════════ */
/* etapaPorDias eliminado del sistema operativo */
function pillEstatus(e){
  if(e==='Liquidado pendiente Core'){
    return `<span class="pill" style="background:#D1FAE5;color:#065F46;border:1.5px solid #6EE7B7;letter-spacing:-.1px">
      Liquidado ★ Core pendiente</span>`;
  }
  const m={'Liquidado':'g','En gestión':'b','Con promesa vigente':'m','Convenio activo':'v',
           'Dictaminación propuesta':'v','Quebranto':'a'};
  return `<span class="pill ${m[e]||'n'}">${e}</span>`;
}

/* Simula la confirmación del Core — en producción llega vía integración */
function confirmarCore(id){
  const c=DB.cuentas.find(x=>x.id===id); if(!c)return;
  c.estatus='Liquidado'; c.saldoCore=0;
  log('Confirmación Core',`${id} · saldo Core = $0`,'Integración Core aplicada','Liquidado pendiente Core','Liquidado');
  toast('Core confirmó saldo en cero. Cuenta liquidada definitivamente.','ok');
  go(currentView);
}

/* ══════════════════════════════════════════════════════════════════
   5. UTILIDADES
   ══════════════════════════════════════════════════════════════════ */
const MESES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const fmt   = n => { const m=MONEDA_INFO[P('MONEDA_SISTEMA')]||MONEDA_INFO.MXN; return m.simbolo+Math.round(n).toLocaleString(m.locale); };
const pct   = n => (n*100).toFixed(1)+'%';
const fecha = d => `${String(d.getDate()).padStart(2,'0')}-${MESES[d.getMonth()]}-${d.getFullYear()}`;
const esc   = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* Categoría del líder de un grupo: se deriva del historial de FALCO si existe; si el líder
   nunca ha tenido un FALCO reportado, se clasifica como "Nuevo" (catálogo CATEGORIA_LIDER). */
const categoriaDeLider = nombreLider => {
  const f = DB.falcos.find(x=>x.lider===nombreLider);
  return (f && f.categoriaLider) || 'Nuevo';
};
/* Traduce el estatus interno de un FALCO a lenguaje natural para pantallas de solo lectura
   (antes se mostraba el código crudo "EN_GESTION"/"RECIBIDO" directamente al usuario). */
const labelEstatusFalco = estatus => ({
  RECIBIDO:'Recibido, sin asignar', EN_GESTION:'En gestión', ESCALADO:'Escalado', RECUPERADO:'Recuperado',
}[estatus] || estatus);

let currentRole='ejecutivo', currentView=null, viewArg=null;

function toast(msg,tipo){
  const h=document.getElementById('toastHost');
  h.innerHTML=`<div class="toast ${tipo||''}">${msg}</div>`;
  setTimeout(()=>{h.innerHTML='';},3200);
}
let _focoPrevioModal=null;
function modal(html,wide){
  _focoPrevioModal=document.activeElement;
  document.getElementById('modalHost').innerHTML=
    `<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" tabindex="-1" id="modalDialog">${html}</div></div>`;
  document.body.style.overflow='hidden';
  const dlg=document.getElementById('modalDialog');
  if(dlg){
    const h=dlg.querySelector('h1,h2,h3');
    if(h && !h.id) h.id='modalTitle';
    if(h) dlg.setAttribute('aria-labelledby','modalTitle');
    const foco=dlg.querySelector('input,select,textarea,button');
    (foco||dlg).focus();
  }
}
function closeModal(){
  document.getElementById('modalHost').innerHTML='';
  document.body.style.overflow='';
  if(_focoPrevioModal && _focoPrevioModal.focus) _focoPrevioModal.focus();
  _focoPrevioModal=null;
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

function log(accion,detalle,motivo,antes,despues){
  /* Cualquier acción con efecto marca la sesión como "con capturas", para
     poder advertir antes de que se pierdan al cerrar o refrescar.
     Se excluyen los eventos de sesión, que no son captura del usuario. */
  if(!/^(Acceso al sistema|Intento de acceso fallido|Cierre de sesión)$/.test(accion)) window.huboCapturas=true;
  DB.bitacora.unshift({
    /* La fecha estaba congelada en '21-ago-2026' mientras la hora sí era real: cualquier
       acción registrada hoy aparecía fechada el 21 de agosto. Ahora usa la fecha del
       sistema (HOY), la misma que rige catorcenas, vencimientos y el reloj de FALCO. */
    ts:`${fecha(HOY)} ${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}`,
    quien:ROLES[currentRole].persona, rol:ROLES[currentRole].label,
    accion, detalle, motivo:motivo||'—', antes:antes==null?'—':String(antes), despues:despues==null?'—':String(despues)
  });
}

/* ══════════════════════════════════════════════════════════════════
   6. MOTOR DE NAVEGACIÓN
   ══════════════════════════════════════════════════════════════════ */
function initRoles(){
  // ic eliminado del selector público por solicitud del cliente
  const visibles=Object.keys(ROLES).filter(k=>k!=='ic');
  document.getElementById('roleSel').innerHTML =
    visibles.map(k=>`<option value="${k}">${ROLES[k].label}</option>`).join('');
}
function menuKeys(rol){ return ROLES[rol].menu.flatMap(g=>g[1]); }

function setRole(r){
  currentRole=r; const R=ROLES[r];
  document.getElementById('roleSel').value=r;
  document.getElementById('uNombre').textContent=R.persona;
  document.getElementById('uRol').textContent=R.label;
  document.getElementById('uAlcance').textContent=R.alcance;
  document.getElementById('topInfo').textContent='Prototipo integral · datos simulados · '+fecha(HOY);
  const noLeidas=currentRole==='ejecutivo'
    ? DB.notificaciones.filter(n=>!n.leida&&!n.rol).length
    : ['jefatura','gerencia'].includes(currentRole)
      ? DB.notificaciones.filter(n=>!n.leida&&n.rol===currentRole).length
      : 0;
  const notifKey=currentRole==='ejecutivo'?'notifs':['jefatura','gerencia'].includes(currentRole)?'notifsJef':null;
  document.getElementById('nav').innerHTML = R.menu.map(([grupo,keys])=>
    (grupo?`<div class="grp">${grupo}</div>`:'')+keys.map(k=>{
      const badge=((k==='notifs'||k==='notifsJef')&&noLeidas>0)?`<span class="nBadge">${noLeidas}</span>`:'';
      return `<button data-k="${k}" onclick="go('${k}')"><span class="ni">${(NAV[k]||'').split(' ')[0]||''}</span><span>${(NAV[k]||'').split(' ').slice(1).join(' ')}</span>${badge}</button>`;
    }).join('')
  ).join('');
  go(menuKeys(r)[0]);
}
function go(k,arg){
  if(!menuKeys(currentRole).includes(k) && k!=='detalle'){ renderLocked(k); return; }
  currentView=k; viewArg=arg||null;
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
  document.querySelector('.side').classList.remove('open');
  const fn = VIEWS[k];
  document.getElementById('main').innerHTML = fn ? fn(arg) : `<h1>${NAV[k]||k}</h1><div class="empty">Vista en construcción.</div>`;
  if(typeof AFTER!=='undefined' && AFTER[k]) { try{ AFTER[k](); }catch(e){ console.warn(e); } }
  window.scrollTo(0,0);
}
function renderLocked(k){
  document.getElementById('main').innerHTML=
    `<div class="locked"><div class="ic">🔒</div><b>Sin permiso para «${NAV[k]||k}»</b>
     El perfil <b>${ROLES[currentRole].label}</b> no tiene acceso a este módulo.<br>
     El permiso se evalúa en la capa de datos, no ocultando el botón.</div>`;
}
function head(titulo,crumb,nota){
  return `<div class="pghead"><h1>${titulo}</h1>${crumb?`<div class="crumb">${crumb}</div>`:''}${nota?`<div class="sub">${nota}</div>`:''}</div>`;
}
function kpi(arr){
  return `<div class="wk">${arr.map(c=>
    `<div class="c"><div class="n">${c.n}</div><div class="l">${c.l}</div>${c.d?`<div class="d ${c.cls||'flat'}">${c.d}</div>`:''}</div>`
  ).join('')}</div>`;
}
function tabla(cols,filas,minw){
  if(!filas.length) return `<div class="empty">Sin registros que coincidan con los filtros aplicados.</div>`;
  return `<div class="scroll"><table${minw?` style="min-width:${minw}px"`:''}>
    <thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${filas.map(f=>`<tr>${f.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function progreso(rec,meta){
  const p=meta?rec/meta:0;
  return `<div class="prog"><i style="width:${Math.min(100,p*100)}%"></i><span class="lbl">${pct(p)} · ${fmt(rec)} de ${fmt(meta)}</span></div>`;
}
function stepper(paso){
  const pasos=['Contacto','Diagnóstico','Negociación','Compromiso','Verificación','Cierre'];
  return `<div class="ciclo">${pasos.map((p,i)=>{
    const n=i+1, cls=n<paso?'done':(n===paso?'now':'');
    return `${i?`<div class="ln ${n<=paso?'done':''}"></div>`:''}
      <div class="st"><div class="dot ${cls}">${n<paso?'✓':n}</div><div class="lb ${n===paso?'now':''}">${p}</div></div>`;
  }).join('')}</div>`;
}

/* Datos derivados según alcance del rol */
/* Convierte cada FALCO activo asignado al ejecutivo en una pseudo-cuenta
   que fluye igual que una cuenta normal en cartera, Mi Cartera, Planeación
   y Detalle. La distinción se hace a nivel de detalle con esFalco:true. */
function cuentasDeFalcos(){
  return DB.falcos
    .filter(f=>f.ejec && f.estatus!=='RECUPERADO')
    .map(f=>({
      /* identificadores */
      id:         f.id,
      esFalco:    true,
      falcoRef:   f,
      /* datos de "cuenta" para que el flujo normal funcione sin cambios */
      cliente:    `Líder ${f.lider}`,
      grupo:      f.grupo,
      lider:      f.lider,
      region:     f.region,
      ruta:       f.ruta,
      marca:      'FALCO',
      jefatura:   'Carmen Vega',
      ejecutivo:  f.ejec,
      /* financiero */
      montoCredito: f.adeudo,
      adeudoAsig:   f.adeudo,
      pagosCapt:    0,
      saldoReal:    f.adeudo,
      /* mora: semanas × 7 días */
      /* CQ-7: antes usaba el campo fijo f.semanas (desalineado de la fecha real).
         Ahora se deriva de la fecha de reporte de Comercial. */
      diasVenc:     (()=>{const d=parseFecha(f.fecha);return d?Math.max(0,Math.floor((HOY-d)/86400000)):0;})(),
      /* operativo */
      estatus:      'En gestión',   /* un FALCO asignado siempre está en gestión, sin importar su antigüedad */
      prob:         falcoEnRiesgo(f) ? 'Baja' : 'Media',
      riesgo:       'Alto',
      plazo:        0, pagoSemanal:0, pagosVencidos:0, pagosLiquidar:0,
      telefono:     f.tel, direccion:'Ver datos del FALCO', aval:'—',
      relacionAval:'—', telefonoAval:'—', direccionAval:'—',
      lat:null, lon:null, paso:2,
      /* extra para el detalle */
      nCli:   f.nCli,
      motivo: f.motivo,
      repPor: f.repPor,
      fechaReporte: f.fecha
    }));
}

function cartera(){
  const falcoCts = cuentasDeFalcos();
  if(currentRole==='ejecutivo'){
    const propias = DB.cuentas.filter(c=>c.ejecutivo==='Felipe Ramírez' && c.estatus!=='Quebranto');
    const miosFalcos = falcoCts.filter(f=>f.ejecutivo==='Felipe Ramírez');
    return [...propias, ...miosFalcos];
  }
  if(currentRole==='jefatura'){ const p=ROLES.jefatura.persona; return [...DB.cuentas.filter(c=>c.jefatura===p), ...falcoCts.filter(f=>f.jefatura===p)]; }
  if(currentRole==='comercial')    return DB.cuentas.filter(c=>c.region==='Jalisco');
  return [...DB.cuentas, ...falcoCts];
}
function diasRestantes(){
  const c=DB.catorcenas[DB.catorcenaActual-1];
  return Math.max(0, Math.ceil((c.fin-HOY)/86400000));
}

const VIEWS={};

/* ══════════════════════════════════════════════════════════════════
   7. VISTAS · EJECUTIVO
   ══════════════════════════════════════════════════════════════════ */
/* Qué significa cada estatus, en palabras que usa el ejecutivo en campo */
const EXPLICA_ESTATUS={
  'En gestión':'Aún la estás trabajando. No hay compromiso ni pago reciente.',
  'Con promesa vigente':'La clienta se comprometió a pagar en una fecha. Toca darle seguimiento.',
  'Convenio activo':'Se acordó pagar en abonos. Cada abono tiene su fecha.',
  'Dictaminación propuesta':'El caso fue propuesto para dictaminación. Pasa a VoBo de Jefatura y Gerencia.',
  'Liquidado pendiente Core':'Cuenta liquidada por el ejecutivo en campo. En espera de validación de operaciones (Core bancario).',
  'Liquidado':'La clienta terminó de pagar. Cuenta cerrada.',
  'Quebranto':'Cartera fuera del alcance de recuperación ordinaria.'
};
/* El ejecutivo no ve quebranto: esa cartera corresponde al Especialista */
const estatusDeRol=()=>currentRole==='ejecutivo'
  ? CATALOGOS.ESTATUS_CUENTA.filter(e=>e!=='Quebranto')
  : CATALOGOS.ESTATUS_CUENTA;

/* Colores semánticos por estatus de cuenta */
const COLOR_ESTATUS={
  'En gestión':'var(--turq)','Con promesa vigente':'var(--amber)','Convenio activo':'var(--violet)',
  'Dictaminación propuesta':'var(--violet)','Liquidado pendiente Core':'var(--turql)',
  'Liquidado':'var(--green)','Quebranto':'var(--red)'
};
/* Parseo de fechas dd-mmm-aaaa y aaaa-mm-dd */
function parseFecha(s){
  if(!s) return null;
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)){const[a,m,d]=s.split('-');return new Date(+a,+m-1,+d);}
  const p=s.split('-'); const im=MESES.indexOf(p[1]);
  return im<0?null:new Date(+p[2],im,+p[0]);
}
const diasHasta=f=>{const d=parseFecha(f);return d?Math.ceil((d-HOY)/86400000):null;};

/* ═══ RELOJ DE RIESGO DE FALCO ════════════════════════════════════════════
   Mide el tiempo TRANSCURRIDO DESDE LA ASIGNACIÓN al ejecutivo (no desde el
   reporte de Comercial, que ocurre ~3 semanas después del faltante).
   Reglas de negocio confirmadas:
   · Reasignar NO reinicia el reloj: fechaAsignacion se fija en la 1a asignación,
     para que reasignar no sirva para "limpiar" el semáforo.
   · El reloj se detiene en ESCALADO y RECUPERADO: la jefatura ya cumplió su parte.
   · Un FALCO sin asignar no tiene reloj (el tablero de Jefatura lo alerta aparte). */
function semanasDesdeAsignacion(f){
  if(!f || !f.ejec || !f.fechaAsignacion) return null;
  const d=parseFecha(f.fechaAsignacion); if(!d) return null;
  return Math.floor((HOY-d)/(86400000*7));
}
const RELOJ_DETENIDO=['ESCALADO','RECUPERADO'];
function falcoEnRiesgo(f){
  if(!f || RELOJ_DETENIDO.includes(f.estatus)) return false;
  const sem=semanasDesdeAsignacion(f);
  return sem!==null && sem>=P('SEMANAS_DESDE_ASIGNACION');
}
/* Etiqueta legible del reloj para mostrar en pantalla. */
function etiquetaRelojFalco(f){
  if(!f) return '—';
  if(!f.ejec) return 'Sin asignar';
  if(RELOJ_DETENIDO.includes(f.estatus)) return f.estatus==='RECUPERADO'?'Recuperado':'Escalado · reloj detenido';
  const sem=semanasDesdeAsignacion(f);
  if(sem===null) return 'Asignado (sin fecha registrada)';
  return `Asignado hace ${sem} semana${sem===1?'':'s'}`;
}

/* Promesas y convenios con compromiso vigente, ordenados por urgencia */
function promesasVigentes(){
  const ids=new Set(cartera().map(c=>c.id));
  return DB.gestiones
    .filter(g=>['Promesa de pago','Convenio'].includes(g.tipo) && g.estado!=='RECHAZADA'
               && ids.has(g.cuentaId) && g.compromiso)
    .map(g=>{
      const c=DB.cuentas.find(x=>x.id===g.cuentaId);
      return {...g, cuenta:c, dias:diasHasta(g.compromiso)};
    })
    .filter(x=>x.cuenta && x.cuenta.estatus!=='Liquidado' && x.dias!==null)
    .sort((a,b)=>a.dias-b.dias);
}
const falcosDe=nombre=>DB.falcos.filter(f=>f.ejec===nombre);


/* ══════════════════════════════════════════════════════════════════
   VISTA · NOTIFICACIONES (Ejecutivo)
   ══════════════════════════════════════════════════════════════════ */
let nFiltro='todas';
const TIPO_LABEL={asignacion:'Cartera',falco:'FALCO',retiro:'Retiro',dictamen:'Dictaminación'};

function marcarTodas(){
  DB.notificaciones.forEach(n=>n.leida=true);
  log('Marcar todo leído','Notificaciones','—',null,'todas leídas');
  go('notifs');
}
function abrirNotif(id){
  const n=DB.notificaciones.find(x=>x.id===id); if(!n) return;
  n.leida=true;
  if(n.accion.arg) go(n.accion.vista,n.accion.arg);
  else go(n.accion.vista);
}

VIEWS.notifs=()=>{
  const todas=DB.notificaciones;
  const noLeidas=todas.filter(n=>!n.leida).length;
  const tipos=[...new Set(todas.map(n=>n.tipo))];
  const filtradas=nFiltro==='todas'?todas:todas.filter(n=>n.tipo===nFiltro);

  return head('Notificaciones','Ejecutivo · avisos del sistema',
    'Aquí aparecen los cambios en tu cartera, asignaciones de FALCO y novedades sobre tus dictaminaciones propuestas.')

  + `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:12px;flex-wrap:wrap">
      <div class="nTabs">
        <button class="nTab ${nFiltro==='todas'?'on':''}" onclick="nFiltro='todas';go('notifs')">
          Todas <span style="font-weight:400">${todas.length}</span>
        </button>
        ${tipos.map(t=>`<button class="nTab ${nFiltro===t?'on':''}" onclick="nFiltro='${t}';go('notifs')">${TIPO_LABEL[t]||t}</button>`).join('')}
      </div>
      ${noLeidas?`<button class="act o sm" onclick="marcarTodas()">Marcar todas como leídas</button>`:''}
    </div>`

  + (noLeidas?`<div class="note info" style="margin-bottom:16px">
      Tienes <b>${noLeidas} aviso${noLeidas===1?'':'s'} sin leer</b>. Los avisos sin leer aparecen resaltados y con el punto azul.
    </div>`:'')

  + `<div class="panel" style="padding:0 22px">
      ${filtradas.length
        ? filtradas.map(n=>`
          <div class="nItem ${n.tipo} ${n.leida?'read':'unread'}" onclick="abrirNotif('${n.id}')">
            <div class="nIco">${n.icono}</div>
            <div class="nDot"></div>
            <div class="nBody">
              <div class="nt">${esc(n.titulo)}</div>
              <div class="nd">${esc(n.detalle)}</div>
              <div class="nm">${n.fecha} · ${n.hora}${n.leida?' · Leída':''}</div>
            </div>
            <span style="font-size:18px;color:var(--line2);flex-shrink:0;margin-top:2px">›</span>
          </div>`).join('')
        : `<div class="empty" style="padding:40px">No hay notificaciones${nFiltro!=='todas'?' de este tipo':''}.</div>`}
    </div>`;
};

VIEWS.miDia=()=>{
  const cs=cartera();
  const persona=ROLES[currentRole].persona;
  const totalAsignado = cs.reduce((s,c)=>s+c.adeudoAsig,0);
  const enGestion     = cs.reduce((s,c)=>s+c.saldoReal,0);
  const recuperado    = totalAsignado-enGestion;
  const avance        = totalAsignado? recuperado/totalAsignado : 0;

  const proms=promesasVigentes();
  const vencidas=proms.filter(p=>p.dias<0);
  const hoyMan  =proms.filter(p=>p.dias>=0&&p.dias<=2);
  const prox    =proms.filter(p=>p.dias>2&&p.dias<=7);
  const porVencer=vencidas.length+hoyMan.length+prox.length;

  const mios=falcosDe(persona);
  const montoFalco=mios.reduce((s,f)=>s+f.adeudo,0);

  const metaCat=P('META_CATORCENAL');
  const eje=DB.ejecutivos.find(x=>x.n===persona);
  const recCatorcena=eje?eje.recuperado:0;
  const logroCat=metaCat?recCatorcena/metaCat:0;

  const porEstatus=estatusDeRol().map(e=>({
    e, n:cs.filter(c=>c.estatus===e).length,
    monto:cs.filter(c=>c.estatus===e).reduce((s,c)=>s+c.saldoReal,0)
  }));
  const maxEst=Math.max(1,...porEstatus.map(x=>x.n));

  /* Cuentas sin ningún registro de gestión, distribuidas por días de mora */
  const conGestion=new Set(DB.gestiones.map(g=>g.cuentaId));
  const sinGestion=cs.filter(c=>!c.esFalco && !conGestion.has(c.id) && c.estatus!=='Liquidado');

  /* ── Tramos automáticos basados en parámetros del sistema ──────────────
     DIAS_MORA_ESCALACION define el umbral de alerta (default 180)
     DIAS_QUEBRANTO define el umbral de quebranto (default 365)
     Los 5 tramos se distribuyen proporcionalmente entre 0 y el quebranto:
       T1: Al corriente (0 días)
       T2: Mora temprana (1 – esc/3)
       T3: Mora media (esc/3 – esc*2/3)
       T4: Mora alta (esc*2/3 – esc)
       T5: Mora crítica / quebranto (esc – ∞)
     Si la cartera tiene todos 0 días se ajusta a rangos cortos.
  ─────────────────────────────────────────────────────────────────────── */
  const ESC  = P('DIAS_MORA_ESCALACION'); // ej. 180
  const QUEB = P('DIAS_QUEBRANTO');        // ej. 365
  const maxDias = sinGestion.length
    ? Math.max(...sinGestion.map(c=>c.diasVenc))
    : 0;

  /* Calcular cortes adaptados a la cartera real */
  function cortesAdaptados(){
    if(maxDias === 0) return [0, 0, 0, 0, 0]; // todo al corriente
    // Anclar en los parámetros del sistema
    const c1 = 0;
    const c2 = Math.round(ESC / 3);           // ej. 60
    const c3 = Math.round(ESC * 2 / 3);       // ej. 120
    const c4 = ESC;                            // ej. 180
    return [c1, c2, c3, c4];
  }
  const [c1,c2,c3,c4] = cortesAdaptados();

  const TRAMOS = [
    { l:'Al corriente',                        min:0,    max:0,      col:'var(--green)'},
    { l:`1 a ${c2} días`,                      min:1,    max:c2,     col:'var(--turq)'},
    { l:`${c2+1} a ${c3}`,                     min:c2+1, max:c3,     col:'var(--turql)'},
    { l:`${c3+1} a ${c4}`,                     min:c3+1, max:c4,     col:'var(--amber)'},
    { l:`${c4+1}+ días`,                       min:c4+1, max:99999,  col:'var(--red)'},
  ].map(t=>{
    const g=sinGestion.filter(c=>c.diasVenc>=t.min&&c.diasVenc<=t.max);
    return {...t, n:g.length, monto:g.reduce((s,c)=>s+c.saldoReal,0)};
  });
  const maxTr=Math.max(1,...TRAMOS.map(t=>t.n));

  const badge=(d)=>{
    if(d<0)  return ['#FBE7E4','var(--red)',  Math.abs(d), d===-1?'día':'días','VENCIDA'];
    if(d===0)return ['#FBE7E4','var(--red)',  'HOY','','VENCE HOY'];
    if(d<=2) return ['#FBF0DD','var(--amber)', d, d===1?'día':'días','POR VENCER'];
    return     ['#EDF6F5','var(--turq)',       d, 'días','VIGENTE'];
  };

  return `<h1 style="margin-bottom:16px">Resumen</h1>`

  /* ── KPI principales ── */
  + `<div class="kpiHero">
      <div class="c hi"><div class="k">Cuentas asignadas</div><div class="v">${cs.length}</div>
        <div class="s">${[...new Set(cs.map(c=>c.grupo))].length} grupos · ${[...new Set(cs.map(c=>c.ruta))].length} rutas</div></div>
      <div class="c"><div class="k">Saldo total asignado</div><div class="v">${fmt(totalAsignado)}</div>
        <div class="s">Fijo al momento de la asignación</div></div>
      <div class="c"><div class="k">Saldo actual en gestión</div><div class="v">${fmt(enGestion)}</div>
        <div class="s">Actualizado desde el Core</div></div>
      <div class="c ${avance>0?'':'wn'}"><div class="k">Recuperado a la fecha</div><div class="v">${fmt(recuperado)}</div>
        <div class="s">${pct(avance)} del saldo asignado</div></div>
    </div>`

  /* ── Barra de avance ── */
  + `<div class="panel">
      <h3>Avance vs meta catorcenal
        <span class="pill ${pillLogro(logroCat)}">Catorcena ${DB.catorcenaActual} · ${diasRestantes()} día${diasRestantes()===1?'':'s'} para el cierre</span></h3>
      ${progreso(recCatorcena,metaCat)}
      <div style="display:flex;justify-content:space-between;margin-top:9px;font-size:11px;color:#8a9098;flex-wrap:wrap;gap:10px">
        <span>Recuperado en la catorcena <b style="color:var(--green)">${fmt(recCatorcena)}</b></span>
        <span>Falta para la meta <b style="color:var(--indigo)">${fmt(Math.max(0,metaCat-recCatorcena))}</b></span>
        <span>Meta catorcenal <b style="color:var(--indigo)">${fmt(metaCat)}</b></span>
      </div>
    </div>`

  /* ── Cuentas por estatus ── */
  + `<div class="panel">
      <h3>Cuentas por estatus <span class="pill n">${cs.length} en total</span></h3>
      <div class="stGrid">${porEstatus.map(x=>
        `<button class="stCard ${x.n?'':'z'}" onclick="irCartera('${x.e}')" ${x.n?'':'disabled'}>
          <div class="cn">${x.n}</div>
          <div class="cl">${x.e}${x.n?`<br><span style="color:#9aa0a6">${fmt(x.monto)}</span>`:''}</div>
          <div class="cbar"><i style="width:${x.n/maxEst*100}%;background:${COLOR_ESTATUS[x.e]}"></i></div>
        </button>`).join('')}</div>
      <div style="font-size:10.5px;color:#9aa0a6;margin-top:11px">Toca un estatus para abrir Mi Cartera con ese filtro aplicado.</div>
    </div>`

  /* ── Cuentas sin gestión registrada ── */
  + `<div class="panel">
      <h3>Cuentas sin ningún registro de gestión
        <span class="pill ${sinGestion.length?'a':'g'}">${sinGestion.length} de ${cs.length}</span></h3>
      <div style="font-size:11px;color:var(--text3);margin:-4px 0 12px">
        Tramos calculados con los parámetros vigentes del sistema:
        escalación a los <b>${ESC} días</b> · quebranto a los <b>${QUEB} días</b>.
        Cortes automáticos: 0 · ${c2} · ${c3} · ${c4} · ${c4+1}+ días.
      </div>
      ${sinGestion.length?`
        <div class="note ${TRAMOS[4].n?'bad':'warn'}" style="margin-bottom:14px">
          Estas cuentas no tienen una sola visita ni contacto capturado desde su asignación${TRAMOS[4].n?`, y <b>${TRAMOS[4].n}</b> de ellas ya supera los ${c4+1} días de mora`:''}.
          Representan <b>${fmt(sinGestion.reduce((s,c)=>s+c.saldoReal,0))}</b> de saldo sin trabajar.
        </div>
        <div class="stGrid">${TRAMOS.map((t,i)=>{
          const labs=['Sin días vencidos','Mora temprana','Mora media','Mora alta','Mora crítica'];
          const urg=['','','⚠️ ','🔴 ','🔴 '];
          return `<div class="stCard ${t.n?'':'z'}" style="cursor:default">
            <div class="cn" style="color:${t.n?t.col:'var(--indigo)'}">${urg[i]||''}${t.n}</div>
            <div class="cl">
              <span style="display:block;font-size:9.5px;font-weight:700;color:${t.col};text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px">${labs[i]}</span>
              ${t.l}${t.n?`<br><span style="color:#9aa0a6;font-size:10px">${fmt(t.monto)}</span>`:''}
            </div>
            <div class="cbar"><i style="width:${t.n/maxTr*100}%;background:${t.col}"></i></div>
          </div>`;}).join('')}</div>
        <div style="margin-top:13px;text-align:right">
          <button class="act o sm" onclick="irCartera('En gestión')">Revisar en Mi Cartera</button></button>
        </div>`
        :'<div class="empty">Todas las cuentas activas tienen al menos una gestión capturada.</div>'}
    </div>`

  /* ── Promesas + FALCO ── */
  + `<div class="cols2">
      <div class="panel">
        <h3>Promesas y convenios por vencer
          <span class="pill ${vencidas.length?'a':hoyMan.length?'m':'b'}">${porVencer?`${porVencer} por vencer`:`${proms.length} vigente${proms.length===1?'':'s'}`}</span></h3>
        ${(vencidas.length||hoyMan.length)?
          `<div class="note ${vencidas.length?'bad':'warn'}" style="margin-bottom:12px">
            ${vencidas.length?`<b>${vencidas.length} compromiso${vencidas.length>1?'s':''} vencido${vencidas.length>1?'s':''}</b> sin pago aplicado. `:''}
            ${hoyMan.length?`<b>${hoyMan.length}</b> vence${hoyMan.length>1?'n':''} en las próximas 48 horas.`:''}
          </div>`:''}
        ${proms.length? proms.slice(0,6).map(p=>{
          const [bg,col,num,uni,txt]=badge(p.dias);
          return `<div class="alertRow">
            <div class="ab" style="background:${bg};color:${col}"><b>${num}</b><span>${uni||txt.split(' ')[0]}</span></div>
            <div class="ax"><b>${esc(p.cuenta.cliente)}</b>
              <span>${p.tipo} · ${fmt(p.monto||p.cuenta.saldoReal)} · ${esc(p.cuenta.ruta)} · vence ${p.compromiso}</span></div>
            <button class="act sm o" onclick="go('detalle','${p.cuenta.id}')">Abrir</button>
          </div>`;}).join('')
          :'<div class="empty">Sin compromisos de pago vigentes.</div>'}
        ${proms.length>6?`<div style="text-align:center;margin-top:10px">
          <button class="act o sm" onclick="irCartera('Con promesa vigente')">Ver los ${proms.length}</button></div>`:''}
      </div>

      <div>
        <div class="falcoBox">
          <div class="fh">FALCO asignados</div>
          <div class="fs">Faltantes de líder de grupo. Es cartera independiente de las cuentas de cliente individual y no forma parte del saldo asignado.</div>
          <div class="falcoNums">
            <div><div class="v">${mios.length}</div><div class="l">Casos a tu cargo</div></div>
            <div><div class="v">${fmt(montoFalco)}</div><div class="l">Monto involucrado</div></div>
          </div>
          ${mios.length? mios.map(f=>
            `<div style="display:flex;gap:10px;align-items:center;padding:9px 0;border-top:1px solid rgba(154,124,74,.18)">
              <span style="font-size:16px">📮</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:12.5px;font-weight:700;color:#7a4f0b">${esc(f.lider)} · ${f.id}</div>
                <div style="font-size:11px;color:#9a7c4a">${esc(f.grupo)} · ${fmt(f.adeudo)} · ${f.nCli} clientes</div>
              </div>
              <button class="act sm o" style="border-color:#f0d8a6;color:#92400E" onclick="go('detalle','${f.id}')">Abrir</button>
            </div>`).join('')
            :'<div style="padding:12px 0;font-size:12px;color:#9a7c4a;text-align:center">Sin faltantes asignados.</div>'}
        </div>
      </div>
    </div>`;
};

/* Abre Mi Cartera con un filtro de estatus preaplicado */
let filtroPendiente=null;
function irCartera(estatus){ filtroPendiente=estatus; go('miCartera'); }

VIEWS.miCartera=()=>{
  const cs=cartera();
  const uniq=k=>[...new Set(cs.map(c=>c[k]))].sort();
  return head('Mi Cartera','Ejecutivo · cuentas asignadas',
    'La cartera se organiza por grupo solidario, que es la unidad natural de visita en campo. Abre un grupo para ver a sus integrantes.')
  + `<div class="filters" style="flex-wrap:wrap;gap:8px">
      <input id="fq" placeholder="Buscar cliente, ID de cuenta o grupo…" 
        style="flex:1;min-width:180px"
        oninput="renderTablaCartera()">
      ${buildFltMenu('fMarca',uniq('marca'),'Marca')}
      ${buildFltMenu('fRuta',uniq('ruta'),'Ruta')}
      ${buildFltMenu('fReg',uniq('region'),'Región')}
      ${buildFltMenu('fEst',estatusDeRol(),'Estatus')}
      <button class="act o" onclick="clearFltAll()">Limpiar todo</button>
    </div>
    <div id="tablaCartera"></div>
    <div class="panel"><h3>Qué significa cada estatus</h3>
      <div class="glos">${estatusDeRol().map(e=>
        `<div class="gi"><span class="gd" style="background:${COLOR_ESTATUS[e]}"></span>
          <div><b>${e}</b><span>${EXPLICA_ESTATUS[e]}</span></div></div>`).join('')}</div>
    </div>`;
};

/* Grupos expandidos en la vista de cartera */
let gruposAbiertos=new Set();
function toggleGrupo(g){ gruposAbiertos.has(g)?gruposAbiertos.delete(g):gruposAbiertos.add(g); renderTablaCartera(); }
function expandirTodos(v){
  gruposAbiertos = v ? new Set(cartera().map(c=>c.grupo)) : new Set();
  renderTablaCartera();
}
function limpiarFiltros(){ clearFltAll(); }

function renderTablaCartera(){
  const fqEl=document.getElementById('fq');
  const q=(fqEl?fqEl.value:'').toLowerCase();
  const st=window.fltState||{fMarca:new Set(),fRuta:new Set(),fReg:new Set(),fEst:new Set()};
  const fm=st.fMarca||new Set(), fr=st.fRuta||new Set(),
        fg=st.fReg||new Set(),  fe=st.fEst||new Set();

  const filtradas=cartera().filter(c=>
    (!q||`${c.cliente} ${c.id} ${c.grupo} ${c.lider}`.toLowerCase().includes(q)) &&
    (!fm.size||fm.has(c.marca)) &&
    (!fr.size||fr.has(c.ruta))  &&
    (!fg.size||fg.has(c.region))&&
    (!fe.size||fe.has(c.estatus)));

  /* Agrupación por grupo solidario */
  const grupos={};
  filtradas.forEach(c=>{ (grupos[c.grupo] ||= []).push(c); });
  const lista=Object.entries(grupos).map(([g,cts])=>({
    g, cts,
    ruta:[...new Set(cts.map(c=>c.ruta))].join(', '),
    region:[...new Set(cts.map(c=>c.region))].join(', '),
    lider:cts[0].lider,
    saldo:cts.reduce((s,c)=>s+c.saldoReal,0),
    asignado:cts.reduce((s,c)=>s+c.adeudoAsig,0),
    mora:Math.max(...cts.map(c=>c.diasVenc)),
    alerta:cts.filter(c=>c.diasVenc>=P('DIAS_MORA_ESCALACION')).length
  })).sort((a,b)=>b.saldo-a.saldo);

  const el=document.getElementById('tablaCartera'); if(!el) return;

  if(!lista.length){
    el.innerHTML=`<div class="panel"><div class="empty">Ninguna cuenta coincide con los filtros aplicados.<br>
      <button class="act o sm" style="margin-top:12px" onclick="limpiarFiltros()">Limpiar filtros</button></div></div>`;
    return;
  }

  const todosAbiertos = lista.every(x=>gruposAbiertos.has(x.g));

  el.innerHTML = `<div class="panel">
      <h3>Grupos <span class="pill n">${lista.length} grupos · ${filtradas.length} cuentas · ${fmt(lista.reduce((s,x)=>s+x.saldo,0))}</span>
        <button class="act o sm" onclick="expandirTodos(${todosAbiertos?'false':'true'})">${todosAbiertos?'Contraer todo':'Expandir todo'}</button></h3>
      ${lista.map(x=>{
        const ab=gruposAbiertos.has(x.g);
        return `<div class="grpBlock ${ab?'on':''}">
          <button class="grpHead" aria-expanded="${ab}" onclick="toggleGrupo('${x.g.replace(/'/g,"\\'")}')">
            <span class="gchev">${ab?'▾':'▸'}</span>
            <span class="gmain">
              <b>${esc(x.g)}</b>
              <span>Líder ${esc(x.lider)} · ${esc(x.region)}</span>
            </span>
            <span class="gstat"><b>${x.cts.length}</b><span>cuenta${x.cts.length===1?'':'s'}</span></span>
            <span class="gstat"><b>${fmt(x.saldo)}</b><span>saldo actual</span></span>
            <span class="gstat"><b>${esc(x.ruta)}</b><span>ruta</span></span>
            ${x.alerta?`<span class="pill a">${x.alerta} en mora alta</span>`:`<span class="pill g">Sin mora alta</span>`}
          </button>
          ${ab?`<div class="grpBody">
            ${tabla(['Cuenta','Cliente','Marca','Saldo actual','Asignado','Días','Gestiones','Estatus','Acciones'],
              x.cts.slice().sort((a,b)=>b.diasVenc-a.diasVenc).map(c=>{
                const ng=DB.gestiones.filter(g=>g.cuentaId===c.id).length;
                return [
                `${c.esFalco?'<span class="pill m" style="margin-right:5px;font-size:9px">FALCO</span>':''}<b>${c.id}</b>`, esc(c.cliente), c.esFalco?'<span class="pill m">Faltante</span>':esc(c.marca),
                `<span class="num">${fmt(c.saldoReal)}</span>`,
                `<span class="num" style="color:#9aa0a6">${fmt(c.adeudoAsig)}</span>`,
                `<span class="num">${c.diasVenc}</span>`,
                `<span class="num ${ng===0?'down':''}">${ng}</span>`,
                pillEstatus(c.estatus),
                `<div class="btnrow"><button class="act sm o" onclick="go('detalle','${c.id}')">Ver detalle</button>
                 <button class="act sm" onclick="abrirGestion('${c.id}')">Gestionar</button></div>`];}),1010)}
          </div>`:''}
        </div>`;
      }).join('')}
    </div>`;
}

VIEWS.detalle=(id)=>{
  const c=DB.cuentas.find(x=>x.id===id)||cuentasDeFalcos().find(x=>x.id===id);
  if(!c) return '<div class="empty">Cuenta no encontrada.</div>';
  const gs=DB.gestiones.filter(g=>g.cuentaId===id);
  const puedeGestionar=currentRole==='ejecutivo';
  /* ── Banner de distinción FALCO ── */
  const bannerFalco = c.esFalco ? `
    <div class="note warn" style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;border-radius:14px;padding:14px 16px">
      <div style="font-size:22px;line-height:1">📮</div>
      <div>
        <div style="font-weight:800;color:var(--indigo);font-size:13.5px;margin-bottom:3px">
          Esta cuenta corresponde a un Faltante de Líder de Grupo (FALCO · ${c.id})
        </div>
        <div style="font-size:12px;color:var(--text2);line-height:1.55">
          Se gestiona igual que cualquier otra cuenta de tu cartera. La diferencia es que el adeudo
          corresponde al faltante del líder <b>${esc(c.lider)}</b>, no a un crédito individual.
          Reportado el ${esc(c.fechaReporte)} por ${esc(c.repPor)}.
        </div>
        <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
          <span class="pill m">Motivo: ${esc(c.motivo)}</span>
          <span class="pill n">${c.nCli} clientes afectados en el grupo</span>
          <span class="pill ${falcoEnRiesgo(c.falcoRef)?'a':'m'}">${etiquetaRelojFalco(c.falcoRef)}</span>
        </div>
      </div>
    </div>` : '';
  const bannerCore = c.estatus==='Liquidado pendiente Core' ? `
    <div class="note" style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;
         background:#D1FAE5;border-color:#6EE7B7;border-left-color:var(--green);border-radius:14px;padding:14px 16px">
      <div style="font-size:22px;line-height:1">★</div>
      <div style="flex:1">
        <div style="font-weight:800;color:#065F46;font-size:13.5px;margin-bottom:3px">
          Pago total registrado — pendiente de confirmación del Core
        </div>
        <div style="font-size:12px;color:#047857;line-height:1.55">
          El ejecutivo capturó el pago en campo. La cuenta quedará liquidada definitivamente cuando el Core confirme que el saldo es cero.
          Mientras tanto aparece como <b>Liquidado ★ Core pendiente</b>.
        </div>
        ${c.saldoCore>0
          ? `<div style="margin-top:8px;font-size:11.5px;color:#065F46">
              Saldo en Core reportado: <b style="font-size:13px">${fmt(c.saldoCore)}</b>
              · Se actualizará en la próxima conciliación.
              ${currentRole==='jefatura'?`<button class="act sm" style="background:var(--green);margin-left:12px" onclick="confirmarCore('${c.id}')">Confirmar Core ($0)</button>`:''}
            </div>`
          : `<div style="margin-top:8px" class="pill g">✓ Core en cero — cerrando cuenta definitivamente</div>`}
      </div>
    </div>` : '';

  /* ── Banner: dictaminación rechazada pendiente de reproponer ── */
  const dictRech = DB.dictaminaciones.filter(d=>d.cuentaId===id).slice(-1)[0];
  const bannerDictRech = (dictRech && ['RECHAZADA_JEFATURA','RECHAZADA_GERENCIA'].includes(dictRech.estado)) ? `
    <div class="note bad" style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;border-radius:14px;padding:14px 16px">
      <div style="font-size:22px;line-height:1">⚖️</div>
      <div style="flex:1">
        <div style="font-weight:800;color:var(--indigo);font-size:13.5px;margin-bottom:3px">
          Dictaminación ${dictRech.id} rechazada por ${dictRech.rechazadoPor||(dictRech.estado==='RECHAZADA_GERENCIA'?'Gerencia':'Jefatura')}
        </div>
        <div style="font-size:12px;color:var(--text2);line-height:1.55">
          <b>Motivo:</b> ${esc(dictRech.motivoRechazo||'—')}
        </div>
        ${puedeGestionar?`<div style="margin-top:10px">
          <button class="act sm" onclick="reproponerDictamen('${dictRech.id}')">↺ Reproponer dictaminación</button>
        </div>`:''}
      </div>
    </div>` : '';

  return head(esc(c.cliente),`Ver detalle · ${c.id}`)
  + bannerCore
  + bannerFalco
  + bannerDictRech
  + `<div class="btnrow" style="margin-bottom:14px">
      <button class="act o" onclick="go(currentRole==='jefatura'?'carteraEquipo':currentRole==='gerencia'||currentRole==='director'?'carterasGer':currentRole==='comercial'?'consultaCom':'miCartera')">← Volver</button>
      ${puedeGestionar?`<button class="act" onclick="abrirGestion('${c.id}')">Registrar gestión</button>`:''}
      ${c.lat?`<a class="act o" target="_blank" rel="noopener" href="https://www.google.com/maps?q=${c.lat},${c.lon}">Ver ubicación</a>`:''}

    </div>`
  + `<div class="panel"><h3>Ciclo de gestión</h3>${stepper(c.paso)}</div>`
  + `<div class="cols2">
      <div class="panel"><h3>Datos del crédito</h3><dl class="dl">
        <dt>Marca</dt><dd>${esc(c.marca)}</dd>
        <dt>Grupo / Líder</dt><dd>${esc(c.grupo)} · ${esc(c.lider)}
          ${(()=>{const cat=categoriaDeLider(c.lider);return ` <span class="pill ${cat==='Confiable'?'g':cat==='En observación'?'m':cat==='Riesgo alto'?'a':'n'}" style="font-size:9.5px">${cat}</span>`;})()}
        </dd>
        <dt>Coordenadas del Grupo</dt><dd>${c.lat&&c.lon?c.lat+', '+c.lon:'<span style="color:var(--text3)">No capturadas</span>'}</dd>
        <dt>Monto del crédito</dt><dd>${fmt(c.montoCredito||c.montoOrig||0)}</dd>
        <dt>Adeudo al asignar</dt><dd>${fmt(c.adeudoAsig)}</dd>
        <dt>Pagos captados</dt><dd class="up">${fmt(c.pagosCapt)}</dd>
        <dt>Saldo real</dt><dd><b>${fmt(c.saldoReal)}</b></dd>
        <dt>Plazo</dt><dd>${c.plazo} semanas · ${fmt(c.pagoSemanal)} semanal</dd>
        <dt>Pagos vencidos</dt><dd>${c.pagosVencidos??c.pagosVenc??'—'} · restan ${c.pagosLiquidar??'—'}</dd>
        <dt>Días vencido</dt><dd>${c.diasVenc}</dd>
        <dt>Probabilidad</dt><dd>${c.prob}</dd>
        <dt>Riesgo</dt><dd>${c.riesgo}</dd>
        <dt>Estatus</dt><dd>${pillEstatus(c.estatus)}</dd>
      </dl></div>
      <div>
        <div class="panel"><h3>Datos de la clienta</h3><dl class="dl">
          <dt>Nombre</dt><dd>${esc(c.cliente)}</dd>
          <dt>Domicilio</dt><dd>${esc(c.direccion)}</dd>
          <dt>Teléfono</dt><dd>${esc(c.telefono)}</dd>
          <dt>Coordenadas</dt><dd>${c.lat?`${c.lat}, ${c.lon}`:'No capturadas'}</dd>
        </dl></div>
        <div class="panel"><h3>Datos del aval</h3>
          ${c.aval==='—'?`<div class="empty" style="padding:18px">Esta cuenta no registra aval.</div>`:`<dl class="dl">
            <dt>Nombre</dt><dd>${esc(c.aval)}</dd>
            <dt>Relación</dt><dd>${esc(c.relacionAval)}</dd>
            <dt>Domicilio</dt><dd>${esc(c.direccionAval||'No capturado')}</dd>
            <dt>Teléfono</dt><dd>${esc(c.telefonoAval)}</dd>
          </dl>`}
          <div class="note" style="margin-top:12px">Todo contacto se realiza bajo el principio de <b>trato digno</b>. No se emplea lenguaje intimidante ni se simula procedimiento judicial.</div>
        </div>
      </div>
    </div>`
  + `<div class="panel"><h3>Historial de gestiones <span class="pill n">${gs.length}</span></h3>
      ${gs.length?`<div class="tl">${gs.slice().reverse().map(g=>
        `<div class="ev"><div class="d">${g.fecha} · ${esc(g.ejecutivo)}${g.contactoCon?' · '+esc(g.contactoCon):''} · <span class="pill ${g.estado==='APROBADA'?'g':g.estado==='RECHAZADA'?'a':'m'}">${g.estado}</span>${g.validadoPorJefatura?` · <span class="pill g" style="font-size:9px">✓ Validada por ${esc(g.validadoPor||'Jefatura')}</span>`:''}</div>
         <div class="t">${g.tipo}${g.monto?` — ${fmt(g.monto)}`:''}${g.folio?` · folio ${g.folio}`:''}</div>
         <div class="x">${esc(g.obs||'')}${g.compromiso?` · compromiso: ${g.compromiso}`:''}${g.motivo?` · motivo: ${g.motivo}`:''}${g.obsJefatura?` · Jefatura: ${esc(g.obsJefatura)}`:''}</div></div>`
      ).join('')}</div>`:'<div class="empty">Sin gestiones registradas.</div>'}
    </div>`;
};

const NOM_DIAS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

/* ── Manejo de semanas ────────────────────────────────────────── */
const soloFecha=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
function lunesDe(d){const x=soloFecha(d);x.setDate(x.getDate()-((x.getDay()+6)%7));return x;}
const claveSem=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const LUNES_HOY=lunesDe(HOY);
let semOffset=0;   /* 0 = semana en curso, negativo = pasado, positivo = futuro */

function semanaActiva(){const off=(typeof window!=='undefined'&&window.semOffset!==undefined)?window.semOffset:semOffset;const d=new Date(LUNES_HOY);d.setDate(d.getDate()+off*7);return d;}
function diasDeSemana(lun){
  return NOM_DIAS.map((l,i)=>{
    const d=new Date(lun); d.setDate(d.getDate()+i);
    return {n:i+1,l,f:`${d.getDate()} ${MESES[d.getMonth()]}`,fecha:d,pasado:d<soloFecha(HOY)};
  });
}
const semanaCerrada=()=>semOffset<0;
function moverSemana(n){ semOffset+=n; window.semOffset=semOffset; go('planeacion'); }
function irSemanaActual(){ semOffset=0; window.semOffset=0; go('planeacion'); }

/* ── Grupos y citas ───────────────────────────────────────────── */
function gruposDeCartera(){
  const cs=cartera(), g={};
  cs.forEach(c=>{ (g[c.grupo] ||= []).push(c); });
  const conGestion=new Set(DB.gestiones.map(x=>x.cuentaId));
  return Object.entries(g).map(([nom,cts])=>({
    nom, cts,
    ruta:[...new Set(cts.map(c=>c.ruta))].join(', '),
    region:[...new Set(cts.map(c=>c.region))].join(', '),
    lider:cts[0].lider,
    saldo:cts.reduce((s,c)=>s+c.saldoReal,0),
    moraMax:Math.max(...cts.map(c=>c.diasVenc)),
    sinGestion:cts.filter(c=>!c.esFalco && !conGestion.has(c.id)).length,
    promesas:cts.filter(c=>c.estatus==='Con promesa vigente').length
  })).sort((a,b)=>b.moraMax-a.moraMax);
}
const citaDe=(nom,sem)=>DB.agenda.find(a=>a.grupo===nom && a.semana===(sem||claveSem(semanaActiva())));

function agendar(nom,dia){
  if(semanaCerrada()){toast('Las semanas anteriores son de solo consulta.','bad');return;}
  if(!dia) return;
  const sem=claveSem(semanaActiva()), dias=diasDeSemana(semanaActiva());
  if(dias[dia-1].pasado){toast('No es posible programar una visita en una fecha ya transcurrida.','bad');return;}
  const c=citaDe(nom,sem);
  if(c){ const antes=NOM_DIAS[c.dia-1]; c.dia=Number(dia);
         log('Reprogramación de visita',`${nom} · semana del ${dias[0].f}`,'Ajuste de ruta semanal',antes,NOM_DIAS[c.dia-1]);
         toast(`${nom} movido a ${NOM_DIAS[c.dia-1]}.`,'ok'); }
  else { DB.agenda.push({grupo:nom,semana:sem,dia:Number(dia),hora:'09:00',hecha:false});
         log('Programación de visita',`${nom} · semana del ${dias[0].f}`,'Planeación semanal','Sin programar',NOM_DIAS[dia-1]);
         toast(`${nom} programado para ${NOM_DIAS[dia-1]}.`,'ok'); }
  go('planeacion');
}
function cambiarHora(nom,h){ if(semanaCerrada())return; const c=citaDe(nom); if(c){c.hora=h;go('planeacion');} }
function quitarCita(nom){
  if(semanaCerrada()){toast('Las semanas anteriores son de solo consulta.','bad');return;}
  const sem=claveSem(semanaActiva());
  const i=DB.agenda.findIndex(a=>a.grupo===nom&&a.semana===sem); if(i<0)return;
  const d=NOM_DIAS[DB.agenda[i].dia-1]; DB.agenda.splice(i,1);
  log('Cancelación de visita',nom,'Retirado de la planeación semanal',d,'Sin programar');
  toast(`${nom} regresó a los grupos sin programar.`); go('planeacion');
}
function autoPlanear(){
  if(semanaCerrada()){toast('Las semanas anteriores son de solo consulta.','bad');return;}
  const sem=claveSem(semanaActiva()), dias=diasDeSemana(semanaActiva()).filter(d=>!d.pasado);
  if(!dias.length){toast('Ya no quedan días hábiles disponibles en esta semana.','bad');return;}
  const libres=gruposDeCartera().filter(g=>!citaDe(g.nom,sem));
  if(!libres.length){toast('Todos los grupos ya están programados en esta semana.');return;}
  libres.forEach(g=>{
    const carga=dias.map(d=>DB.agenda.filter(a=>a.semana===sem&&a.dia===d.n).length);
    const dia=dias[carga.indexOf(Math.min(...carga))].n;
    DB.agenda.push({grupo:g.nom,semana:sem,dia,hora:'09:00',hecha:false});
  });
  log('Planeación automática',`${libres.length} grupo(s) · semana del ${diasDeSemana(semanaActiva())[0].f}`,'Balanceo por carga diaria','Sin programar','Programados');
  toast(`${libres.length} grupo(s) distribuidos en la semana.`,'ok'); go('planeacion');
}
function limpiarAgenda(){
  if(semanaCerrada()){toast('Las semanas anteriores son de solo consulta.','bad');return;}
  const sem=claveSem(semanaActiva());
  const n=DB.agenda.filter(a=>a.semana===sem).length;
  if(!n){toast('La semana ya está vacía.');return;}
  DB.agenda=DB.agenda.filter(a=>a.semana!==sem);
  log('Vaciado de agenda',`${n} visita(s) · semana del ${diasDeSemana(semanaActiva())[0].f}`,'Replanificación de la semana',`${n} programadas`,'Sin programar');
  toast('Semana vaciada.'); go('planeacion');
}

/* Filtros del buscador de grupos */
let fPlan={q:'',ruta:'',region:''};
function filtrarPlan(k,v){ fPlan[k]=v; renderPoolGrupos(); }
function limpiarFiltrosPlan(){ fPlan={q:'',ruta:'',region:''}; go('planeacion'); }

VIEWS.planeacion=()=>{
  const lun=semanaActiva(), sem=claveSem(lun), dias=diasDeSemana(lun);
  const cerrada=semanaCerrada();
  const grupos=gruposDeCartera();
  const citas=DB.agenda.filter(a=>a.semana===sem);
  const programados=grupos.filter(g=>citas.some(a=>a.grupo===g.nom));
  const libres=grupos.filter(g=>!citas.some(a=>a.grupo===g.nom));
  const hechas=citas.filter(a=>a.hecha).length;
  const rango=`${dias[0].f} al ${dias[5].f} de ${dias[5].fecha.getFullYear()}`;
  const etiqueta = semOffset===0?'Semana en curso' : semOffset<0
      ? `Hace ${-semOffset} semana${semOffset===-1?'':'s'}` : `En ${semOffset} semana${semOffset===1?'':'s'}`;

  return head('Planeación Semanal','Ejecutivo · agenda de visitas',
    'Organiza la ruta por grupo solidario. Puedes avanzar o retroceder de semana; las semanas ya transcurridas quedan disponibles solo para consulta.')

  /* ── Navegador de semanas ── */
  + `<div class="semNav">
      <button class="act o" onclick="moverSemana(-1)">‹ Anterior</button>
      <div class="semTit">
        <b>${rango}</b>
        <span class="pill ${semOffset===0?'b':cerrada?'n':'v'}">${etiqueta}</span>
      </div>
      <div class="btnrow">
        ${semOffset!==0?`<button class="act o" onclick="irSemanaActual()">Ir a la semana en curso</button>`:''}
        <button class="act o" onclick="moverSemana(1)">Siguiente ›</button>
      </div>
    </div>`

  + (cerrada?`<div class="note warn"><b>Semana cerrada.</b> Esta agenda ya transcurrió y se conserva como historial. Puedes consultarla, pero no reprogramar ni eliminar visitas.</div>`:'')

  + kpi([
      {n:grupos.length,l:'Grupos en tu cartera'},
      {n:programados.length,l:'Grupos programados',cls:programados.length===grupos.length?'up':'flat'},
      {n:cerrada?hechas:libres.length,l:cerrada?'Visitas realizadas':'Sin programar',cls:cerrada?(hechas===citas.length?'up':'down'):(libres.length?'down':'up')},
      {n:fmt(programados.reduce((s,g)=>s+g.saldo,0)),l:'Saldo cubierto por la agenda'}
    ])

  + (cerrada?'':`<div class="btnrow" style="margin-bottom:16px">
      <button class="act" onclick="autoPlanear()">Distribuir automáticamente</button>
      <button class="act o" onclick="limpiarAgenda()">Vaciar la semana</button>
    </div>`)

  /* ── Buscador de grupos sin programar ── */
  + (cerrada?'':`<div class="panel">
      <h3>Grupos sin programar <span class="pill ${libres.length?'a':'g'}">${libres.length}</span></h3>
      ${libres.length?`
        <div class="filters">
          <input id="pq" placeholder="Buscar grupo, líder o ruta…" value="${esc(fPlan.q)}" oninput="filtrarPlan('q',this.value)">
          <select onchange="filtrarPlan('ruta',this.value)"><option value="">Todas las rutas</option>
            ${[...new Set(grupos.map(g=>g.ruta))].sort().map(r=>`<option ${r===fPlan.ruta?'selected':''}>${r}</option>`).join('')}</select>
          <select onchange="filtrarPlan('region',this.value)"><option value="">Todos los estados</option>
            ${[...new Set(grupos.map(g=>g.region))].sort().map(r=>`<option ${r===fPlan.region?'selected':''}>${r}</option>`).join('')}</select>
          <button class="act o" onclick="limpiarFiltrosPlan()">Limpiar</button>
        </div>
        <div id="poolGrupos"></div>`
        :`<div class="empty">Todos los grupos de tu cartera tienen visita programada esta semana.</div>`}
    </div>`)

  /* ── Rejilla de la semana ── */
  + `<div class="panel">
      <h3>Semana del ${rango}</h3>
      <div class="agGrid">${dias.map(d=>{
        const cs=citas.filter(a=>a.dia===d.n)
          .map(a=>({...a,g:grupos.find(x=>x.nom===a.grupo)})).filter(a=>a.g)
          .sort((a,b)=>a.hora.localeCompare(b.hora));
        const nCt=cs.reduce((s,a)=>s+a.g.cts.length,0);
        const hoyEs = soloFecha(d.fecha).getTime()===soloFecha(HOY).getTime();
        const bloq = cerrada || d.pasado;
        return `<div class="agDay ${hoyEs?'hoy':''} ${bloq?'blk':''}">
          <div class="dh"><span style="font-size:11px;color:var(--indigo)">${d.l}${hoyEs?' · hoy':''}</span>
            <span>${d.f}${nCt?` · ${nCt} cta${nCt===1?'':'s'}`:''}</span></div>
          ${cs.length?cs.map(a=>
            `<div class="agCard ${a.hecha?'done':''}">
              <div class="an">${esc(a.g.nom)}
                ${a.hecha?'<span class="pill g" style="margin-left:6px">Realizada</span>'
                        :(bloq?'<span class="pill a" style="margin-left:6px">No realizada</span>':'')}</div>
              <div class="ad">${a.g.cts.length} cuenta${a.g.cts.length===1?'':'s'} · ${fmt(a.g.saldo)}<br>
                Ruta ${esc(a.g.ruta)} · líder ${esc(a.g.lider)}
                ${a.g.promesas&&!bloq?`<br><b style="color:var(--amber)">${a.g.promesas} promesa${a.g.promesas===1?'':'s'} vigente${a.g.promesas===1?'':'s'}</b>`:''}</div>
              ${bloq?`<div style="font-size:10.5px;color:#8a9098">Visita de las ${a.hora}</div>`
                    :`<div class="ac">
                        <input type="time" value="${a.hora}" onchange="cambiarHora('${esc(a.g.nom).replace(/'/g,"\\'")}',this.value)">
                        <select onchange="agendar('${esc(a.g.nom).replace(/'/g,"\\'")}',this.value)">
                          ${dias.map(x=>`<option value="${x.n}" ${x.n===a.dia?'selected':''} ${x.pasado?'disabled':''}>${x.l}</option>`).join('')}
                        </select>
                        <button class="act sm r" onclick="quitarCita('${esc(a.g.nom).replace(/'/g,"\\'")}')">Quitar</button>
                      </div>`}
            </div>`).join('')
            :`<div class="agEmpty">${bloq?'Sin visitas':'Sin visitas<br>programadas'}</div>`}
        </div>`;
      }).join('')}</div>
    </div>`

  /* ── Detalle por día — con drill down colapsable ── */
  + (()=>{
    if(typeof window.planDiasAb==='undefined') window.planDiasAb=new Set();
    // Promesas agendadas: cuentas cuya promesa de pago cae en un día de esta semana
    const promesasPorDia={};
    dias.forEach(d=>{
      const fechaDia=d.fecha;
      const proms=cartera().filter(c=>{
        const g=DB.gestiones.filter(x=>x.cuentaId===c.id&&x.tipo==='Promesa de pago'&&x.compromiso);
        return g.some(x=>{
          if(!x.compromiso) return false;
          // Comparar la fecha de compromiso con el día
          const partes=x.compromiso.split('-');
          if(partes.length!==3) return false;
          const d2=new Date(x.compromiso+'T00:00:00');
          return d2.getTime()===soloFecha(fechaDia).getTime();
        });
      });
      if(proms.length) promesasPorDia[d.n]=proms;
    });

    const hayCitas=citas.length>0;
    const hayPromesas=Object.keys(promesasPorDia).length>0;
    if(!hayCitas&&!hayPromesas) return '<div class="panel"><h3>Detalle de cuentas por día</h3><div class="empty">No hay visitas ni promesas registradas esta semana.</div></div>';

    return `<div class="panel">
      <h3>Detalle de cuentas por día
        <span style="font-size:11px;font-weight:500;color:var(--text3);margin-left:8px">
          Clic en el día para ver las cuentas
        </span>
      </h3>
      ${dias.map(d=>{
        const gs=citas.filter(a=>a.dia===d.n).map(a=>grupos.find(x=>x.nom===a.grupo)).filter(Boolean);
        const proms=promesasPorDia[d.n]||[];
        if(!gs.length&&!proms.length) return '';
        const cts=gs.flatMap(g=>g.cts);
        const abKey='d'+d.n;
        const ab=window.planDiasAb.has(abKey);
        const totalCtas=cts.length+proms.length;
        return `<div class="grpBlock ${ab?'on':''}" style="margin-bottom:8px">
          <button class="grpHead" aria-expanded="${ab}" onclick="window.planDiasAb=window.planDiasAb||new Set();
            window.planDiasAb.has('${abKey}')?window.planDiasAb.delete('${abKey}'):window.planDiasAb.add('${abKey}');
            go('planeacion')">
            <span class="gchev">${ab?'▾':'▸'}</span>
            <div class="gmain">
              <b>${d.l} ${d.f}</b>
              <span>${gs.length} grupo${gs.length===1?'':'s'} · ${cts.length} cuentas${proms.length?` · <span style="color:var(--amber)">${proms.length} promesa${proms.length===1?'':'s'}</span>`:''}
              · ${fmt(cts.reduce((s,c)=>s+c.saldoReal,0))}</span>
            </div>
            <span class="pill ${ab?'b':'n'}">${totalCtas} cuenta${totalCtas===1?'':'s'}</span>
          </button>
          ${ab?`<div class="grpBody">
            ${proms.length?`<div style="background:#FEF3C7;border-radius:8px;padding:10px 14px;margin-bottom:10px">
              <div style="font-size:11px;font-weight:700;color:var(--amber);margin-bottom:6px">
                📅 ${proms.length} promesa${proms.length===1?'':'s'} de pago para este día
              </div>
              ${proms.map(c=>`<div style="display:flex;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid rgba(224,138,30,.2)">
                <div style="flex:1;min-width:0">
                  <span style="font-weight:700;color:var(--indigo)">${esc(c.cliente)}</span>
                  <span style="font-size:11px;color:var(--text3);margin-left:8px">${c.id}</span>
                </div>
                <span style="font-weight:700;color:var(--amber)">${fmt(c.saldoReal)}</span>
                ${!(cerrada||d.pasado)?`<button class="act sm" onclick="abrirGestion('${c.id}')">Gestionar</button>`:''}
              </div>`).join('')}
            </div>`:''}
            ${cts.length?tabla(['Grupo','Cuenta','Cliente','Saldo','Días','Estatus',...(cerrada||d.pasado?[]:[''])],
              cts.slice().sort((a,b)=>b.diasVenc-a.diasVenc).map(c=>{
                const fila=[esc(c.grupo),`<b>${c.id}</b>`,esc(c.cliente),fmt(c.saldoReal),
                  `<span class="pill ${c.diasVenc>=P('DIAS_MORA_ESCALACION')?'m':'b'}">${c.diasVenc}</span>`,
                  pillEstatus(c.estatus)];
                if(!(cerrada||d.pasado)) fila.push(`<button class="act sm" onclick="abrirGestion('${c.id}')">Gestionar</button>`);
                return fila;}),880):''}
          </div>`:''}
        </div>`;
      }).join('')}
    </div>`;
  })();
};

/* Tarjetas de grupos sin programar, con filtros aplicados */
function renderPoolGrupos(){
  const el=document.getElementById('poolGrupos'); if(!el) return;
  const sem=claveSem(semanaActiva()), dias=diasDeSemana(semanaActiva());
  const q=fPlan.q.toLowerCase();
  const libres=gruposDeCartera().filter(g=>!citaDe(g.nom,sem))
    .filter(g=>(!q||`${g.nom} ${g.lider} ${g.ruta}`.toLowerCase().includes(q))
            && (!fPlan.ruta||g.ruta===fPlan.ruta) && (!fPlan.region||g.region===fPlan.region));
  if(!libres.length){ el.innerHTML='<div class="empty">Ningún grupo sin programar coincide con los filtros.</div>'; return; }
  el.innerHTML=`<div style="font-size:10.5px;color:#8a9098;margin-bottom:9px">${libres.length} grupo${libres.length===1?'':'s'} · ${fmt(libres.reduce((s,g)=>s+g.saldo,0))} de saldo</div>
    <div class="agPool">${libres.map(g=>
    `<div class="agCard" style="background:#FBF0DD;border-color:#f0d8a6">
      <div class="an">${esc(g.nom)}</div>
      <div class="ad">${g.cts.length} cuenta${g.cts.length===1?'':'s'} · ${fmt(g.saldo)} · ruta ${esc(g.ruta)}<br>
        Líder ${esc(g.lider)} · mora máxima ${g.moraMax} días${g.sinGestion?` · <b style="color:var(--red)">${g.sinGestion} sin gestión</b>`:''}</div>
      <div class="ac"><span style="font-size:10.5px;color:#6b7177">Programar el</span>
        <select onchange="agendar('${esc(g.nom).replace(/'/g,"\\'")}',this.value)">
          <option value="">Elegir día…</option>
          ${dias.filter(d=>!d.pasado).map(d=>`<option value="${d.n}">${d.l} ${d.f}</option>`).join('')}</select>
      </div>
    </div>`).join('')}</div>`;
}

/* Semanas de una catorcena: la 1 arranca el día de inicio, la 2 siete días después */
const rangoCorto=(a,b)=>`${a.getDate()} ${MESES[a.getMonth()]} – ${b.getDate()} ${MESES[b.getMonth()]}`;

/* Serie semanal enriquecida con fechas y meta */
function serieSemanal(){
  const metaSem=P('META_CATORCENAL')/2;
  const _sf=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
  const hoyMs=_sf(HOY).getTime();
  return DB.semanas.map(w=>{
    const a=parseFecha(w.ini), b=new Date(a); b.setDate(b.getDate()+6);
    /* "curso" se calcula contra la fecha real del sistema (igual que el estado de las
       catorcenas), en vez de depender de una bandera fija en la semilla que quedaba
       desactualizada apenas avanzaba la fecha real. */
    const curso = hoyMs>=_sf(a).getTime() && hoyMs<=_sf(b).getTime();
    return {...w, fecha:a, fin:b, metaSem, logro:metaSem?w.rec/metaSem:0, curso};
  });
}

VIEWS.misCatorcenas=()=>{
  const serie=serieSemanal();
  const cat=DB.catorcenas[DB.catorcenaActual-1];
  const metaCat=P('META_CATORCENAL'), metaSem=metaCat/2;
  const deLaCat=serie.filter(w=>w.cat===DB.catorcenaActual);

  /* Totales de la catorcena en curso */
  const tot=deLaCat.reduce((a,w)=>({
    cuentas:a.cuentas+w.cuentas, pagos:a.pagos+w.pagos, clientes:a.clientes+w.clientes, rec:a.rec+w.rec
  }),{cuentas:0,pagos:0,clientes:0,rec:0});
  const logroCat=metaCat?tot.rec/metaCat:0;

  const ult=serie[serie.length-1], prev=serie[serie.length-2];
  const dif=(a,b)=>{const d=a-b; return `<span class="${d>0?'up':d<0?'down':'flat'}">${d>0?'▲':d<0?'▼':'▬'} ${Math.abs(d)}</span>`;};
  const maxRec=Math.max(...serie.map(w=>w.rec),metaSem);

  return head('Mis Catorcenas','Ejecutivo · seguimiento de resultados',
    `Cómo se comportó tu trabajo semana a semana. La catorcena se compone de dos semanas y la meta del periodo es ${fmt(metaCat)}, es decir ${fmt(metaSem)} por semana.`)

  /* ── Catorcena en curso ── */
  + `<div class="panel">
      <h3>Catorcena ${DB.catorcenaActual} en curso
        <span class="pill b">${fecha(cat.inicio)} al ${fecha(cat.fin)} · ${diasRestantes()} día${diasRestantes()===1?'':'s'} para el cierre</span></h3>
      <div class="kpiHero" style="margin-bottom:14px">
        <div class="c hi"><div class="k">Cuentas con registro</div><div class="v">${tot.cuentas}</div>
          <div class="s">Cuentas donde capturaste al menos una gestión, sin importar el resultado</div></div>
        <div class="c"><div class="k">Pagos registrados</div><div class="v">${tot.pagos}</div>
          <div class="s">Número de abonos capturados en la catorcena</div></div>
        <div class="c"><div class="k">Clientas que pagaron</div><div class="v">${tot.clientes}</div>
          <div class="s">Personas distintas con al menos un pago</div></div>
        <div class="c"><div class="k">Monto recuperado</div><div class="v">${fmt(tot.rec)}</div>
          <div class="s">${pct(logroCat)} de la meta de ${fmt(metaCat)}</div></div>
      </div>
      ${progreso(tot.rec,metaCat)}
      <div style="display:flex;justify-content:space-between;margin-top:9px;font-size:11px;color:#8a9098;flex-wrap:wrap;gap:10px">
        <span>Recuperado <b style="color:var(--green)">${fmt(tot.rec)}</b></span>
        <span>Falta <b style="color:var(--indigo)">${fmt(Math.max(0,metaCat-tot.rec))}</b></span>
        <span>Meta de la catorcena <b style="color:var(--indigo)">${fmt(metaCat)}</b></span>
      </div>
    </div>`

  /* ── Comparativa contra la semana anterior ── */
  + `<div class="panel">
      <h3>Tu semana actual comparada con la anterior</h3>
      ${tabla(['Indicador','Semana anterior','Semana actual','Cambio'],[
        ['Cuentas con registro',prev.cuentas,`<b>${ult.cuentas}</b>`,dif(ult.cuentas,prev.cuentas)],
        ['Pagos registrados',prev.pagos,`<b>${ult.pagos}</b>`,dif(ult.pagos,prev.pagos)],
        ['Clientas que pagaron',prev.clientes,`<b>${ult.clientes}</b>`,dif(ult.clientes,prev.clientes)],
        ['Monto recuperado',fmt(prev.rec),`<b>${fmt(ult.rec)}</b>`,
          `<span class="${ult.rec>=prev.rec?'up':'down'}">${ult.rec>=prev.rec?'▲':'▼'} ${fmt(Math.abs(ult.rec-prev.rec))}</span>`],
        ['% vs meta semanal',pct(prev.logro),`<b>${pct(ult.logro)}</b>`,
          `<span class="${ult.logro>=prev.logro?'up':'down'}">${ult.logro>=prev.logro?'▲':'▼'} ${((ult.logro-prev.logro)*100).toFixed(1)} pp</span>`]
      ],560)}
      ${ult.curso?`<div class="note">La semana actual va a la mitad: cierra el ${fecha(new Date(ult.fin))}. La comparación se completa al terminar.</div>`:''}
    </div>`

  /* ── Gráfica semanal ── */
  + `<div class="panel">
      <h3>Monto recuperado por semana <span class="pill n">Últimas ${serie.length} semanas</span></h3>
      <div class="chartW">
        <div class="cwPlot">
          <div class="metaLn" style="bottom:${metaSem/maxRec*100}%"><span>Meta semanal ${fmt(metaSem)}</span></div>
          <div class="cwBars">
            ${serie.map(w=>{
              const col=w.logro>=1?'var(--green)':w.logro>=uObjetivo()?'var(--turq)':'var(--amber)';
              return `<div class="cw" title="${rangoCorto(w.fecha,w.fin)} · ${fmt(w.rec)} · ${pct(w.logro)}">
                <i style="height:${Math.max(2,w.rec/maxRec*100)}%;background:${col}${w.curso?';opacity:.62':''}">
                  <b>${(w.rec/1000).toFixed(1)}k</b></i>
              </div>`;}).join('')}
          </div>
        </div>
        <div class="cwBars cwAxis">
          ${serie.map(w=>`<div class="cw"><span>C${w.cat}<br><em>S${w.sc}</em></span></div>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:10.5px;color:#8a9098;margin-top:14px">
        <span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--green);margin-right:5px"></i>Alcanzaste o superaste la meta semanal</span>
        <span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--turq);margin-right:5px"></i>Entre ${uObjetivoPct()} % y 99 %</span>
        <span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--amber);margin-right:5px"></i>Por debajo del ${uObjetivoPct()} %</span>
      </div>
    </div>`

  /* ── Tabla semana a semana: 6 recientes + historial con buscador ── */
  + (()=>{
    if(typeof window.catBusqHist==='undefined') window.catBusqHist='';
    const busqH=window.catBusqHist||'';
    const LIMITE=6; // Últimas 6 semanas en detalle
    const maxSem=P('SEMANAS_HISTORIAL_MAX'); // Mostrar máximo 53 semanas totales
    const serieCorte=serie.slice().reverse().slice(0,maxSem);
    const recientes=serieCorte.slice(0,LIMITE);
    const historico=serieCorte.slice(LIMITE).filter(w=>
      !busqH||rangoCorto(w.fecha,w.fin).toLowerCase().includes(busqH.toLowerCase())
        ||(w.cat+'').includes(busqH));

    const cols=['Semana','Año · Catorcena','Cuentas','Pagos','Clientas','Recuperado','% meta'];
    const fmtRow=w=>[
      `<b>${rangoCorto(w.fecha,w.fin)}</b>${w.curso?' <span class="pill b">En curso</span>':''}`,
      `${w.fecha?new Date(w.fecha).getFullYear():'—'} · C${w.cat} S${w.sc}`,
      `<span class="num">${w.cuentas}</span>`,
      `<span class="num">${w.pagos}</span>`,
      `<span class="num">${w.clientes}</span>`,
      `<span class="num">${fmt(w.rec)}</span>`,
      `<span class="pill ${w.logro>=1?'g':w.logro>=uObjetivo()?'b':'m'}">${pct(w.logro)}</span>`
    ];

    return `<div class="panel">
      <h3>Detalle semana a semana
        <span style="font-size:11px;font-weight:500;color:var(--text3);margin-left:8px">Últimas 6 semanas</span>
      </h3>
      ${tabla(cols,recientes.map(fmtRow),880)}

      <!-- Historial colapsado -->
      <details style="margin-top:14px">
        <summary style="cursor:pointer;font-size:12.5px;font-weight:700;color:var(--indigo);
             padding:10px 0;border-top:1px solid var(--line);list-style:none;
             display:flex;align-items:center;gap:8px">
          <span>📁 Historial — semanas anteriores</span>
          <span class="pill n">${serieCorte.length-LIMITE} semanas</span>
        </summary>
        <div style="margin-top:12px">
          <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
            <input type="search" placeholder="Buscar semana o catorcena…"
              style="flex:1;padding:8px 12px;border:1.5px solid var(--line);border-radius:9px;font-size:12px"
              value="${esc(busqH)}"
              oninput="window.catBusqHist=this.value;go('misCatorcenas')">
            <button class="act o sm" ${busqH?'':'style="opacity:.4;cursor:default"'}
              onclick="${busqH?`window.catBusqHist='';go('misCatorcenas')`:''}">✕ Limpiar</button>
          </div>
          ${historico.length
            ? tabla(cols,historico.map(fmtRow),880)
            : `<div class="empty">${busqH?'Sin semanas que coincidan con "'+esc(busqH)+'"':'Sin semanas históricas.'}</div>`}
        </div>
      </details>

      <div class="note" style="margin-top:12px">
        <b>Cuentas con registro</b> cuenta las cuentas donde quedó al menos una gestión en bitácora.
        Es la medida de tu actividad en campo. Total mostrado: hasta 53 semanas.
      </div>
    </div>`;
  })();
};

/* ══════════════════════════════════════════════════════════════════
   8. REGISTRO DE GESTIÓN (2 pasos) + COMPROBANTE
   ══════════════════════════════════════════════════════════════════ */

function abrirDictaminacion(id){
  const c=DB.cuentas.find(x=>x.id===id)||cuentasDeFalcos().find(x=>x.id===id);
  modal(`<h3>⚖️ Proponer dictaminación</h3>
    <div class="msub">${esc(c.cliente)} · ${c.id}</div>
    <div class="note warn" style="margin-bottom:14px">
      Al proponer la dictaminación, la cuenta pasa a <b>Dictaminación propuesta</b> y queda en espera del VoBo de tu Jefatura.
      Una vez que Jefatura otorgue el VoBo, pasa a Gerencia para aprobación final.
    </div>
    <div class="field"><label for="dMotivo">Categoría de dictaminación *</label>
      <select id="dMotivo" onchange="mostrarDescDict(this.value)">
        <option value="">— Selecciona la categoría —</option>
        ${CATALOGOS.MOTIVO_DICTAMINACION.map(m=>`<option>${m}</option>`).join('')}
      </select>
      <div id="gDictDesc" class="hint" style="min-height:18px;margin-top:5px;color:var(--turq);font-weight:500"></div>
    </div>
    <div class="field"><label for="dHallazgos">Descripción de los hallazgos en campo</label>
      <textarea id="dHallazgos" placeholder="Describe lo que encontraste: cuántas visitas realizaste, qué encontraste en el domicilio, qué dijo el aval, etc."></textarea></div>
    <fieldset class="field"><legend>Documentos que soportan el caso <span style="font-size:10px;color:var(--text3)">(selecciona los que anexas)</span></legend>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${(CATALOGOS.DOCUMENTOS_DICT||[]).map(dcto=>`<label style="display:flex;align-items:center;gap:6px;font-size:12px;
          padding:4px 10px;border:1.5px solid var(--line);border-radius:20px;cursor:pointer">
          <input type="checkbox" name="dDocto" value="${esc(dcto)}" style="accent-color:var(--turq)"> ${esc(dcto)}
        </label>`).join('')}
      </div>
    </fieldset>
    <div class="note info"><b>Recuerda:</b> esta acción queda registrada en el expediente de la cuenta y en la bitácora del sistema. No puede deshacerse sin la intervención de Jefatura.</div>
    <div class="mfoot"><button class="act o" onclick="abrirGestion('${id}')">← Atrás</button>
      <button class="act i" onclick="guardarDictaminacion('${id}')">Proponer dictaminación</button></div>`,true);
}
function guardarDictaminacion(id){
  const c=DB.cuentas.find(x=>x.id===id)||cuentasDeFalcos().find(x=>x.id===id);
  const motivo=(document.getElementById('dMotivo')||{}).value||'';
  const hallazgos=(document.getElementById('dHallazgos')||{}).value||'';
  const documentos=[...document.querySelectorAll('input[name="dDocto"]:checked')].map(chk=>chk.value);
  if(!motivo){toast('Selecciona el motivo de la dictaminación.','bad');return;}
  if(!hallazgos.trim()){toast('Describe los hallazgos en campo.','bad');return;}
  /* Crear registro en DB */
  DB.dictaminaciones.push({
    id:'D-'+(DB.dictaminaciones.length+1).toString().padStart(3,'0'),
    cuentaId:id, cliente:c.cliente,
    ejecutivo:ROLES[currentRole].persona,
    fecha:fecha(HOY), resolucion:'Propuesta de dictaminación',
    hallazgos:`Motivo: ${motivo}. ${hallazgos}`,
    documentos,
    estado:'PENDIENTE_VOBO',
    rechazadoPor:null, motivoRechazo:null
  });
  /* Cambiar estatus de la cuenta */
  const cu=DB.cuentas.find(x=>x.id===id);
  if(cu) cu.estatus='Dictaminación propuesta';
  /* Notificación al ejecutivo */
  DB.notificaciones.unshift({
    id:'N-D'+Date.now(),tipo:'dictamen',icono:'⚖️',
    titulo:'Dictaminación propuesta — '+c.cliente,
    detalle:'Tu propuesta de dictaminación para '+c.cliente+' ('+c.id+') fue enviada a Jefatura para VoBo. Motivo: '+motivo,
    fecha:fecha(HOY),hora:new Date().toTimeString().slice(0,5),leida:false,
    accion:{vista:'detalle',arg:id}
  });
  log('Propuesta de dictaminación',c.id+' · '+c.cliente+' · '+motivo,hallazgos,'En gestión','Dictaminación propuesta');
  closeModal();
  toast('Dictaminación propuesta enviada a Jefatura para VoBo.','ok');
  go(currentView);
}

/* ── Reproposición de una dictaminación rechazada: reabre el MISMO expediente,
     conservando el historial del/los intento(s) anterior(es) en vez de crear un caso nuevo. ── */
function reproponerDictamen(id){
  const d=DB.dictaminaciones.find(x=>x.id===id);
  if(!d) return;
  const c=DB.cuentas.find(x=>x.id===d.cuentaId)||cuentasDeFalcos().find(x=>x.id===d.cuentaId);
  modal(`<h3>↺ Reproponer dictaminación ${d.id}</h3>
    <div class="msub">${esc(c.cliente)} · ${d.cuentaId}</div>
    <div class="note bad" style="margin-bottom:14px">
      <b>Rechazo anterior (${esc(d.rechazadoPor||'Jefatura')}):</b> ${esc(d.motivoRechazo||'—')}
    </div>
    <div class="field"><label for="dMotivo2">Categoría de dictaminación *</label>
      <select id="dMotivo2" onchange="mostrarDescDict(this.value,'gDictDesc2')">
        <option value="">— Selecciona la categoría —</option>
        ${CATALOGOS.MOTIVO_DICTAMINACION.map(m=>`<option ${d.hallazgos&&d.hallazgos.startsWith('Motivo: '+m)?'selected':''}>${m}</option>`).join('')}
      </select>
      <div id="gDictDesc2" class="hint" style="min-height:18px;margin-top:5px;color:var(--turq);font-weight:500"></div>
    </div>
    <div class="field"><label for="dHallazgos2">Qué se corrigió o complementó desde el rechazo</label>
      <textarea id="dHallazgos2" placeholder="Describe la información adicional que atiende el motivo de rechazo indicado arriba."></textarea></div>
    <fieldset class="field"><legend>Documentos que soportan el caso</legend>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${(CATALOGOS.DOCUMENTOS_DICT||[]).map(dcto=>`<label style="display:flex;align-items:center;gap:6px;font-size:12px;
          padding:4px 10px;border:1.5px solid var(--line);border-radius:20px;cursor:pointer">
          <input type="checkbox" name="dDocto2" value="${esc(dcto)}" ${(d.documentos||[]).includes(dcto)?'checked':''} style="accent-color:var(--turq)"> ${esc(dcto)}
        </label>`).join('')}
      </div>
    </fieldset>
    <div class="note info"><b>Este mismo expediente (${d.id})</b> conserva el historial del intento anterior; no se crea un caso nuevo.</div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act i" onclick="confirmarReproposicion('${id}')">Reenviar a Jefatura</button></div>`,true);
}
function confirmarReproposicion(id){
  const d=DB.dictaminaciones.find(x=>x.id===id);
  const motivo=(document.getElementById('dMotivo2')||{}).value||'';
  const hallazgos=(document.getElementById('dHallazgos2')||{}).value||'';
  const documentos=[...document.querySelectorAll('input[name="dDocto2"]:checked')].map(chk=>chk.value);
  if(!motivo){toast('Selecciona el motivo de la dictaminación.','bad');return;}
  if(!hallazgos.trim()){toast('Describe qué se corrigió desde el rechazo.','bad');return;}
  const estadoAnterior=d.estado;
  d.historialRechazos = d.historialRechazos||[];
  d.historialRechazos.push({estado:estadoAnterior,rechazadoPor:d.rechazadoPor,motivoRechazo:d.motivoRechazo,fecha:d.fecha});
  d.hallazgos=`Motivo: ${motivo}. ${hallazgos}`;
  d.documentos=documentos;
  d.estado='PENDIENTE_VOBO';
  d.rechazadoPor=null; d.motivoRechazo=null;
  d.fecha=fecha(HOY);
  const cu=DB.cuentas.find(x=>x.id===d.cuentaId);
  if(cu) cu.estatus='Dictaminación propuesta';
  log('Reproposición de dictaminación',`${d.id} · ${d.cliente} · intento #${d.historialRechazos.length+1}`,hallazgos,estadoAnterior,'PENDIENTE_VOBO');
  closeModal();
  toast('Dictaminación reenviada a Jefatura para VoBo. Se conservó el historial del intento anterior.','ok');
  go(currentView);
}

const TIPOS=[
  {k:'Pago total',      ic:'💰', d:'Liquidación completa del saldo real'},
  {k:'Pago parcial',    ic:'💵', d:'Abono a cuenta con folio de recibo'},
  {k:'Promesa de pago', ic:'📅', d:'Compromiso con fecha y monto'},
  {k:'Convenio',        ic:'🤝', d:'Reestructura en abonos'},
  {k:'Sin contacto',    ic:'🚪', d:'Visita sin localizar al titular'},
  {k:'Negativa de pago',ic:'✋', d:'Titular manifiesta no pagar'},
  {k:'Cambio de domicilio',ic:'📍',d:'Actualización de dirección'},
  {k:'Ilocalizable',    ic:'❓', d:'Sin rastro tras múltiples visitas'},
  {k:'Dictaminación',   ic:'⚖️', d:'Proponer la dictaminación de esta cuenta — pasa a VoBo de Jefatura'}
];
function abrirGestion(id){
  const c=DB.cuentas.find(x=>x.id===id);
  modal(`<h3>Registrar gestión</h3>
    <div class="msub" style="margin-bottom:16px">${esc(c.cliente)} · ${c.id} · saldo real ${fmt(c.saldoReal)} · ${c.diasVenc} días vencidos</div>
    <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">
      Paso 1 · ¿Cuál fue el resultado de la visita?
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
      ${TIPOS.map(t=>`
        <button onclick="gestionPaso2('${id}','${t.k}')"
          style="text-align:left;padding:12px 14px;border-radius:11px;border:1.5px solid var(--line);
                 background:var(--surface);cursor:pointer;transition:all .15s;
                 display:flex;align-items:flex-start;gap:10px;width:100%"
          onmouseover="this.style.borderColor='var(--turq)';this.style.background='var(--tint)'"
          onmouseout="this.style.borderColor='var(--line)';this.style.background='var(--surface)'">
          <span style="font-size:18px;line-height:1;flex-shrink:0;margin-top:1px">${t.ic}</span>
          <span style="min-width:0">
            <span style="display:block;font-size:13px;font-weight:700;color:var(--indigo);line-height:1.3">${t.k}</span>
            <span style="display:block;font-size:11px;color:var(--text3);margin-top:3px;line-height:1.4">${t.d}</span>
          </span>
        </button>`).join('')}
    </div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button></div>`,true);
}
function gestionPaso2(id,tipo){
  const c=DB.cuentas.find(x=>x.id===id);
  const conMonto=['Pago total','Pago parcial','Promesa de pago','Convenio'].includes(tipo);
  const conFolio=['Pago total','Pago parcial'].includes(tipo);
  const conFecha=['Promesa de pago','Convenio'].includes(tipo);
  const conMotivo=['Sin contacto','Negativa de pago','Ilocalizable'].includes(tipo);
  const conDom  = tipo==='Cambio de domicilio';
  const esDictam= tipo==='Dictaminación';
  if(esDictam){ abrirDictaminacion(id); return; }
  /* Folio automático visible desde el inicio */
  const folioAuto='REC-'+Math.floor(10000+Math.random()*89999);

  modal(`<h3>${tipo}</h3>
    <div class="msub" style="margin-bottom:14px">Paso 2 de 2 · ${esc(c.cliente)} · ${c.id}</div>
    ${conMonto?`
    <div class="field">
      <label for="gMonto">${tipo==='Pago total'?'Monto a liquidar':'Monto del abono'}</label>
      <input type="number" id="gMonto"
        value="${tipo==='Pago total'?c.saldoReal:''}"
        ${tipo==='Pago total'?'readonly':''}
        placeholder="0"
        style="font-size:17px;font-weight:700;padding:11px 14px">
      <div class="hint">Saldo real de la cuenta: <b>${fmt(c.saldoReal)}</b>. El monto no puede excederlo.</div>
    </div>`:''}
    ${conFolio?`
    <div class="field">
      <label for="gFolio">Folio del recibo</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input id="gFolio" value="${folioAuto}"
          style="font-family:monospace;letter-spacing:.5px;flex:1"
          placeholder="${folioAuto}">
        <button class="act o sm" type="button"
          onclick="document.getElementById('gFolio').value='REC-'+Math.floor(10000+Math.random()*89999)">
          ↺ Nuevo
        </button>
      </div>
      <div class="hint">Folio generado automáticamente. Puedes reemplazarlo con el folio del recibo físico.</div>
    </div>`:''}
    ${conFecha?`
    <div class="field">
      <label for="gFecha">Fecha de compromiso</label>
      <input type="date" id="gFecha" value="2026-09-04">
    </div>`:''}
    ${conMotivo?`
    <div class="field">
      <label for="gMotivo">Motivo</label>
      <select id="gMotivo">${CATALOGOS.MOTIVO_NO_PAGO.map(m=>`<option>${m}</option>`).join('')}</select>
    </div>`:''}
    ${conDom?`
    <div class="field">
      <label for="gDom">Nuevo domicilio</label>
      <input id="gDom" placeholder="Calle, número, colonia, ciudad, estado">
    </div>`:''}
    <div class="field">
      <label for="gObs">Observaciones de la visita</label>
      <textarea id="gObs" placeholder="Describe objetivamente lo ocurrido. Este texto queda en el expediente." style="min-height:72px"></textarea>
    </div>
    ${P('HABILITAR_GPS')?`
    <label class="checkline">
      <input type="checkbox" id="gGps" checked>
      <span>Adjuntar coordenadas de la visita
        <br><span style="font-weight:400;font-size:11px;color:#8a9098">${c.lat?`${c.lat}, ${c.lon}`:'Se capturarán al guardar'}</span>
      </span>
    </label>`:''}
    <label class="checkline">
      <input type="checkbox" id="gEvi" onchange="toggleEviUpload(this.checked)">
      <span>Adjuntar evidencia fotográfica
        <br><span style="font-weight:400;font-size:11px;color:#8a9098">Recibo, fachada o documento firmado</span>
      </span>
    </label>
    <div id="eviUpload" style="display:none;margin-top:8px">
      <input type="file" id="gEviFile" accept="image/*,.pdf"
        style="width:100%;padding:9px 12px;border:1.5px dashed var(--turql);border-radius:9px;
               background:var(--tint);font-size:12px;cursor:pointer">
      <div class="hint">Formatos: JPG, PNG, PDF · máx. 5 MB</div>
    </div>
    ${tipo==='Pago total'?`
    <div class="note" style="margin-top:14px;background:#EEF9F4;border-color:#A7F3D0;border-left-color:var(--green)">
      <b>La cuenta quedará liquidada en el sistema una vez que el monto ingrese al Core.</b>
      Mientras el adeudo en Core sea mayor a cero, la cuenta aparecerá como
      <span style="background:#D1FAE5;color:var(--green);padding:1px 7px;border-radius:10px;font-size:11px;font-weight:700">
        Liquidado pendiente Core ★
      </span>.
      Cuando el Core confirme el saldo en cero, el cierre será definitivo.
    </div>`:tipo==='Pago parcial'?`
    <div class="note" style="margin-top:14px">
      El abono se aplica de inmediato. El I&amp;C verificará el folio contra el Core en la conciliación de catorcena.
    </div>`:`
    <div class="note" style="margin-top:14px">
      Esta gestión queda en el expediente de la cuenta para seguimiento.
    </div>`}
    <div class="mfoot">
      <button class="act o" onclick="abrirGestion('${id}')">← Atrás</button>
      <button class="act" onclick="guardarGestion('${id}','${tipo}')">Guardar gestión</button>
    </div>`);
}
function guardarGestion(id,tipo){
  const c=DB.cuentas.find(x=>x.id===id);
  const monto=Number((document.getElementById('gMonto')||{}).value||0);
  const obs=(document.getElementById('gObs')||{}).value||'';
  if(['Pago total','Pago parcial','Promesa de pago','Convenio'].includes(tipo)){
    if(!monto){toast('Captura el monto para continuar.','bad');return;}
    if(monto>c.saldoReal){toast('El monto excede el saldo real de la cuenta.','bad');return;}
  }
  const folio=(document.getElementById('gFolio')||{}).value || 'REC-'+Math.floor(10000+Math.random()*89999);
  const contactoCon=(()=>{const r=document.querySelector('input[name="gContacto"]:checked');return r?r.value:null;})();
  const g={id:'G-'+Math.floor(4500+Math.random()*400),cuentaId:id,ejecutivo:ROLES[currentRole].persona,
    fecha:fecha(HOY),tipo,monto:monto||undefined,folio:['Pago total','Pago parcial'].includes(tipo)?folio:undefined,
    compromiso:(document.getElementById('gFecha')||{}).value||undefined,
    motivo:(document.getElementById('gMotivo')||{}).value||undefined,
    contactoCon,obs,estado:'APROBADA',cat:DB.catorcenaActual};
  DB.gestiones.push(g);

  /* ── CASCADA DE ESTADO ──────────────────────────────────────────────────
     Los pagos aplican inmediatamente al registrarse.
     La cuenta solo se marca como "Liquidado" definitivo cuando el Core confirme saldo = 0.
     Mientras tanto queda en "Liquidado pendiente Core".
  ─────────────────────────────────────────────────────────────────────── */
  if(tipo==='Pago total'||tipo==='Pago parcial'){
    c.pagosCapt+=monto;
    c.saldoReal=Math.max(0,c.saldoReal-monto);
    if(tipo==='Pago total'){
      /* La cuenta queda en "Liquidado pendiente Core" —
         se liquida definitivamente cuando el Core confirme saldo = 0 */
      c.estatus='Liquidado pendiente Core';
      c.paso=6;
      c.saldoCore=c.saldoReal;
    } else {
      c.paso=Math.max(c.paso,4);
    }
    const ej=DB.ejecutivos.find(x=>x.n===ROLES[currentRole].persona); if(ej) ej.recuperado+=monto;
    const jef=DB.jefaturas.find(x=>x.n==='Carmen Vega'); if(jef) jef.recuperado+=monto;
    const pais=DB.paises.find(x=>x.p==='México'); if(pais) pais.recuperado+=monto;
  }
  if(tipo==='Promesa de pago'){c.estatus='Con promesa vigente'; c.paso=Math.max(c.paso,4);}
  if(tipo==='Convenio'){c.estatus='Convenio activo'; c.paso=Math.max(c.paso,4);}
  if(tipo==='Cambio de domicilio'){const d=(document.getElementById('gDom')||{}).value; if(d)c.direccion=d;}
  if(['Sin contacto','Ilocalizable'].includes(tipo)) c.paso=Math.max(c.paso,2);

  log('Registro de gestión',`${tipo} en ${id} (${c.cliente})${monto?' por '+fmt(monto):''}`,
      '—',null,'APROBADA');
  closeModal();

  if(['Pago total','Pago parcial'].includes(tipo)){ comprobante(g,c); }
  else { toast('Gestión registrada. Queda pendiente de autorización.','ok'); go(currentView); }
}

function comprobante(g,c){
  const cv=document.createElement('canvas'); cv.width=640; cv.height=430;
  const x=cv.getContext('2d');
  x.fillStyle='#fff'; x.fillRect(0,0,640,430);
  x.fillStyle='#353266'; x.fillRect(0,0,640,74);
  [[9,'#7DD3CE'],[14,'#199C9A'],[20,'#ffffff']].forEach((b,i)=>{x.fillStyle=b[1];x.fillRect(30+i*7,50-b[0],5,b[0]);});
  x.fillStyle='#fff'; x.font='bold 19px Arial'; x.fillText('Grupo Finvivir · Comprobante de gestión',58,34);
  x.font='12px Arial'; x.fillStyle='#A9AEE0'; x.fillText('Documento informativo. No sustituye estado de cuenta oficial.',58,54);
  const filas=[['Folio',g.folio],['Cliente',c.cliente],['Cuenta',c.id],['Concepto',g.tipo],
    ['Monto',fmt(g.monto)],['Saldo posterior',fmt(c.saldoReal)],['Fecha',g.fecha],
    ['Ejecutivo',g.ejecutivo],['Estado',g.estado==='PENDIENTE'?'Pendiente de conciliación':'Conciliado']];
  let y=112;
  filas.forEach(([l,v])=>{
    x.font='bold 10px Arial'; x.fillStyle='#8a9098'; x.fillText(String(l).toUpperCase(),34,y);
    x.font='15px Arial'; x.fillStyle='#353266'; x.fillText(String(v),230,y);
    x.strokeStyle='#EEF1F3'; x.beginPath(); x.moveTo(34,y+9); x.lineTo(606,y+9); x.stroke();
    y+=34;
  });
  x.fillStyle='#199C9A'; x.font='11px Arial';
  x.fillText('Emitido conforme al Manual de Cobranza · trato digno y trazabilidad.',34,418);
  const url=cv.toDataURL('image/png');
  const txt=encodeURIComponent(`Grupo Finvivir\nComprobante ${g.folio}\nCliente: ${c.cliente}\nConcepto: ${g.tipo}\nMonto: ${fmt(g.monto)}\nSaldo posterior: ${fmt(c.saldoReal)}\nFecha: ${g.fecha}`);
  modal(`<h3>Gestión registrada</h3><div class="msub">Se generó el comprobante ${g.folio}</div>
    <img src="${url}" style="width:100%;border:1px solid var(--line);border-radius:10px">
    <div class="note ok" style="margin-top:12px">
      El saldo de la cuenta se actualizó a <b>${fmt(c.saldoReal)}</b>.
      ${g.tipo==='Pago total'
        ? 'La cuenta quedará <b>liquidada definitivamente</b> cuando el adeudo en Core sea cero.'
        : `Tu recuperado de la catorcena subió <b>${fmt(g.monto)}</b>.`}
    </div>
    <div class="mfoot">
      <a class="act o" download="comprobante-${g.folio}.png" href="${url}">Descargar PNG</a>
      ${P('HABILITAR_WHATSAPP')?`<a class="act o" target="_blank" rel="noopener" href="https://wa.me/?text=${txt}">Enviar por WhatsApp</a>`:''}
      <button class="act" onclick="closeModal();go(currentView)">Listo</button></div>`);
}

/* ══════════════════════════════════════════════════════════════════
   9. VISTAS · JEFATURA
   ══════════════════════════════════════════════════════════════════ */
/* Equipo real de la jefatura EN SESIÓN (vía reportaA, la fuente autoritativa de jerarquía).
   Antes traía a los 6 ejecutivos de toda la empresa sin importar quién iniciaba sesión —
   Carmen Vega veía en su propio tablero a Jorge Núñez, que reporta a Paola Vega. */
/* ═══ FUENTE ÚNICA DE VERDAD — jerarquía y agregados ═══════════════════════════
   Reglas de negocio confirmadas:
   · La plantilla de una jefatura son los usuarios cuyo reportaA es esa jefatura.
   · Un ejecutivo SIN cuentas asignadas NO tiene meta (no entra en el agregado).
   · La meta y el recuperado de una jefatura son SIEMPRE la suma de su plantilla:
     nunca se leen de un campo agregado estático (eso generaba dos verdades).
   · El alcance de una gerencia son las jefaturas cuyo reportaA es esa gerencia
     Y que tengan al menos un ejecutivo con cuentas.
   · cuentasReales() reemplaza el campo fijo e.cuentas: se cuenta en vivo. */
/* ═══ SEMAFORIZACIÓN DE CUMPLIMIENTO — fuente única (CQ-1) ══════════════════
   Antes los colores comparaban contra 75%/50% literales mientras los conteos
   usaban los parámetros configurables (70%/50%): al ajustar el parámetro, el
   número y el color se contradecían. Ahora todo deriva de los mismos valores. */
const uObjetivo = () => P('UMBRAL_LOGRO_OBJETIVO')/100;   // fracción (0.70)
const uRiesgo   = () => P('UMBRAL_LOGRO_RIESGO')/100;     // fracción (0.50)
const uObjetivoPct = () => P('UMBRAL_LOGRO_OBJETIVO');    // entero (70)
const uRiesgoPct   = () => P('UMBRAL_LOGRO_RIESGO');      // entero (50)
/* logro se recibe como fracción (0.72). Devuelven token de color / clase / emoji. */
const colorLogro   = l => l>=uObjetivo()?'var(--green)'   :l>=uRiesgo()?'var(--amber)'   :'var(--red)';
const colorLogroBg = l => l>=uObjetivo()?'var(--green-bg)':l>=uRiesgo()?'var(--amber-bg)':'var(--red-bg)';
const claseLogro   = l => l>=uObjetivo()?'green'          :l>=uRiesgo()?'amber'          :'violet';
const pillLogro    = l => l>=uObjetivo()?'g'              :l>=uRiesgo()?'m'              :'a';
const emojiLogro   = l => l>=uObjetivo()?'🟢'             :l>=uRiesgo()?'🟡'             :'🔴';

const cuentasReales = nombreEj => DB.cuentas.filter(c=>c.ejecutivo===nombreEj).length;

/* A-07/A-09: alcance autorizado de un ejecutivo. Una cuenta o FALCO NO puede asignarse
   a un ejecutivo cuya región no esté en su alcance (regla de negocio: restricción dura). */
function alcanceEjecutivo(nombreEj){
  const u=DB.usuarios.find(x=>x.n===nombreEj)||{};
  return {regiones:u.regiones||[], marcas:u.marcas||[]};
}
/* A-10: chip persistente de filtros activos. Aplica a CUALQUIER filtro, no solo
   marca/región — antes el filtro de Ejecutivo no avisaba nada. */
function chipsFiltros(pares, onLimpiar){
  const act=pares.filter(p=>p[1]);
  if(!act.length) return '';
  return `<div class="note info" style="margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <b>🔎 Estás viendo datos filtrados:</b>
    ${act.map(p=>`<span class="pill b">${p[0]}: ${esc(String(p[1]))}</span>`).join('')}
    <button class="act o sm" style="margin-left:auto" onclick="${onLimpiar}">✕ Limpiar filtros</button>
  </div>`;
}
/* A-12: estado vacío explícito cuando un filtro no devuelve registros, en vez de
   mostrar $0 y 0.0% que se leen como desempeño real en cero. */
function estadoVacioFiltro(onLimpiar){
  return `<div class="panel"><div class="empty" style="padding:38px 20px">
    <div style="font-size:34px;margin-bottom:10px">🔍</div>
    <div style="font-size:15px;font-weight:700;color:var(--indigo);margin-bottom:6px">Sin datos para los filtros seleccionados</div>
    <div style="font-size:12.5px;color:var(--text3);max-width:440px;margin:0 auto 16px">
      No hay ejecutivos con cartera que coincidan. Los indicadores no se muestran para no
      confundir la ausencia de datos con un desempeño de cero.</div>
    <button class="act o" onclick="${onLimpiar}">✕ Limpiar filtros</button>
  </div></div>`;
}
function puedeAtenderRegion(nombreEj, region){
  const a=alcanceEjecutivo(nombreEj);
  return !region || a.regiones.length===0 || a.regiones.includes(region);
}
/* Devuelve los motivos por los que un ejecutivo NO puede tomar un conjunto de cuentas. */
function bloqueosDeAsignacion(nombreEj, cuentas){
  const a=alcanceEjecutivo(nombreEj);
  const regFuera=[...new Set(cuentas.map(c=>c.region).filter(r=>r&&a.regiones.length&&!a.regiones.includes(r)))];
  const marFuera=[...new Set(cuentas.map(c=>c.marca).filter(m=>m&&a.marcas.length&&!a.marcas.includes(m)))];
  return {regFuera, marFuera};
}
const ejecutivoTieneCartera = nombreEj => cuentasReales(nombreEj) > 0;

/* Plantilla directa de una jefatura (por reportaA). Si soloConCartera=true,
   excluye a los ejecutivos sin cuentas, que por regla de negocio no tienen meta. */
function plantillaDeJefatura(nombreJefatura, soloConCartera){
  return DB.ejecutivos.filter(e=>{
    const u=DB.usuarios.find(x=>x.n===e.n);
    if(!u || u.reportaA!==nombreJefatura) return false;
    return soloConCartera ? ejecutivoTieneCartera(e.n) : true;
  });
}

/* Jefaturas bajo una gerencia: reportaA = esa gerencia Y con al menos un
   ejecutivo con cartera. Define el alcance de Gerencia y de Dirección. */
function jefaturasDeGerencia(nombreGerencia){
  return DB.jefaturas.filter(j=>{
    const u=DB.usuarios.find(x=>x.n===j.n);
    if(!u || u.reportaA!==nombreGerencia) return false;
    return plantillaDeJefatura(j.n, true).length > 0;
  });
}

/* Agregado canónico de una jefatura: derivado, nunca del campo estático. */
function agregadoJefatura(nombreJefatura){
  const ejs=plantillaDeJefatura(nombreJefatura, true);
  const meta=ejs.reduce((a,e)=>a+e.meta,0);
  const recuperado=ejs.reduce((a,e)=>a+e.recuperado,0);
  return {ejs, meta, recuperado, logro: meta? recuperado/meta : 0};
}

const equipo=()=>{
  const persona=ROLES[currentRole]?.persona;
  return DB.ejecutivos
    .filter(e=>{
      const u=DB.usuarios.find(x=>x.n===e.n);
      if(!u) return false;                       // sin identidad no entra a la plantilla
      if(u.reportaA!==persona) return false;
      return ejecutivoTieneCartera(e.n);         // sin cuentas asignadas no tiene meta
    })
    .map(e=>{
      const logro=e.meta? e.recuperado/e.meta : 0;
      return {...e, cuentas:cuentasReales(e.n), logro, pctv:logro*100, tend:e.prev[5]-e.prev[4]};
    });
};

/* ── Filtrado real de marca/región sobre indicadores agregados ───────────────────
   e.recuperado y e.meta son un total único por ejecutivo y catorcena: el sistema no
   registra cuánto de ese total corresponde a cada marca o región. Por eso, aplicar un
   filtro de Marca/Región a estos indicadores es una aproximación, no un dato exacto:
   se prorratea según qué porción del saldo de cartera del ejecutivo (dato que SÍ está
   etiquetado por marca/región a nivel cuenta) cae dentro del filtro. Sin filtro de
   marca/región, o al filtrar por un ejecutivo específico, el valor es exacto — no una
   aproximación. El filtro de Ejecutivo siempre es exacto porque selecciona una persona
   completa, no una fracción de sus cuentas. */
function aplicarFiltroEquipo(eq, fEj, fMar, fReg){
  let lista = fEj ? eq.filter(e=>e.n===fEj) : eq;
  if(!fMar && !fReg) return lista;
  return lista.map(e=>{
    const todas = DB.cuentas.filter(c=>c.ejecutivo===e.n);
    const filtradas = todas.filter(c=>(!fMar||c.marca===fMar)&&(!fReg||c.region===fReg));
    const saldoTotal = todas.reduce((s,c)=>s+c.saldoReal,0);
    const saldoFiltrado = filtradas.reduce((s,c)=>s+c.saldoReal,0);
    const prop = todas.length ? (saldoTotal>0 ? saldoFiltrado/saldoTotal : 0) : 1;
    return {...e, recuperado:e.recuperado*prop, meta:e.meta*prop, _cuentasFiltro:filtradas, _prorrateado:todas.length>0};
  }).filter(e=>!e._cuentasFiltro || e._cuentasFiltro.length>0 || !e._prorrateado);
}

/* ══ Notificaciones compartidas Jefatura / Gerencia ══ */
VIEWS.notifsJef=()=>{
  const rolFiltro=currentRole==='gerencia'?'gerencia':'jefatura';
  const todas=DB.notificaciones.filter(n=>n.rol===rolFiltro);
  const noLeidas=todas.filter(n=>!n.leida).length;
  const tipos=[...new Set(todas.map(n=>n.tipo))];
  const filtradas=nFiltroJef==='todas'?todas:todas.filter(n=>n.tipo===nFiltroJef);
  const TIPO_L={dictamen:'Dictaminación',asignacion:'Asignación',alerta:'Alerta',escalacion:'Escalación'};
  return head('Notificaciones',currentRole==='gerencia'?'Gerencia · avisos del sistema':'Jefatura · avisos del sistema',
    'Avisos de dictaminaciones pendientes de VoBo, alertas de desempeño del equipo y escalaciones.')
  + `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:12px;flex-wrap:wrap">
      <div class="nTabs">
        <button class="nTab ${nFiltroJef==='todas'?'on':''}" onclick="nFiltroJef='todas';go('notifsJef')">Todas ${todas.length}</button>
        ${tipos.map(t=>`<button class="nTab ${nFiltroJef===t?'on':''}" onclick="nFiltroJef='${t}';go('notifsJef')">${TIPO_L[t]||t}</button>`).join('')}
      </div>
      ${noLeidas?`<button class="act o sm" onclick="marcarTodasJef()">Marcar todas como leídas</button>`:''}
    </div>`
  + (noLeidas?`<div class="note info" style="margin-bottom:16px">Tienes <b>${noLeidas} aviso${noLeidas===1?'':' sin leer'}${noLeidas===1?' sin leer':''}</b>.</div>`:'')
  + `<div class="panel" style="padding:0 22px">
      ${filtradas.length
        ? filtradas.map(n=>`
          <div class="nItem ${n.tipo} ${n.leida?'read':'unread'}" onclick="abrirNotifJef('${n.id}')">
            <div class="nIco">${n.icono}</div>
            <div class="nDot"></div>
            <div class="nBody">
              <div class="nt">${esc(n.titulo)}</div>
              <div class="nd">${esc(n.detalle)}</div>
              <div class="nm">${n.fecha} · ${n.hora}${n.leida?' · Leída':''}</div>
            </div>
            <span style="font-size:18px;color:var(--line2);flex-shrink:0;margin-top:2px">›</span>
          </div>`).join('')
        : `<div class="empty" style="padding:40px">Sin notificaciones.</div>`}
    </div>`;
};
let nFiltroJef='todas';
function marcarTodasJef(){ const r=currentRole==='gerencia'?'gerencia':'jefatura'; DB.notificaciones.filter(n=>n.rol===r).forEach(n=>n.leida=true); go('notifsJef'); }
function abrirNotifJef(id){ const n=DB.notificaciones.find(x=>x.id===id); if(!n)return; n.leida=true; go(n.accion.vista,n.accion.arg); }


/* ══ TABLERO DIRECTOR — solo lectura ══ */

/* ══════════════════════════════════════════════════════════════════
   VISTAS · ESPECIALISTA DE INFORMACIÓN Y CONTROL (I&C)
   Reporta directo a Gerencia. Visión objetiva de la operación.
   ══════════════════════════════════════════════════════════════════ */

/* ── Tablero I&C ── */

VIEWS.agendaEquipo=()=>{
  const NOM=['Lun','Mar','Mié','Jue','Vie','Sáb'];
  if(typeof window.agendaEjFiltro==='undefined') window.agendaEjFiltro='';
  const semActiva=semanaActiva();
  const sem=claveSem(semActiva);
  const dias=diasDeSemana(semActiva);
  const fEj=window.agendaEjFiltro||'';

  // Ejecutivos reales de la jefatura en sesión (vía reportaA — antes estaba fijo a 'Carmen Vega'
  // sin importar quién iniciara sesión, y mezclaba ejecutivos de otras jefaturas)
  const personaJef=ROLES[currentRole]?.persona;
  const todosEjs=DB.ejecutivos.filter(e=>{
    const u=DB.usuarios.find(x=>x.n===e.n);
    return u ? u.reportaA===personaJef : true;
  });
  if(!todosEjs.length) return head('Agenda del Equipo','Jefatura · vista de solo lectura','Sin ejecutivos registrados.');

  // Ejecutivos visibles según filtro
  const ejsVis=fEj?todosEjs.filter(e=>e.n===fEj):todosEjs;

  // Todas las citas de la semana para los ejecutivos visibles
  const todasCitas=DB.agenda.filter(a=>
    a.semana===sem&&(fEj?a.ejecutivo===fEj:ejsVis.some(e=>e.n===a.ejecutivo))
  );

  // Calcular logros por ejecutivo
  const logroEj=n=>{
    const e=DB.ejecutivos.find(x=>x.n===n);
    if(!e||!e.meta) return 0;
    return e.recuperado/e.meta;
  };

  return head('Agenda del Equipo','Jefatura · vista consolidada de visitas',
    'Vista de todos los grupos a visitar esta semana. Usa el filtro para ver ejecutivo por ejecutivo.')

  // Navegación de semana + filtro ejecutivo
  +`<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;flex-wrap:wrap">
      <div style="font-size:13px;font-weight:700;color:var(--indigo)">
        Semana del ${dias[0].f} al ${dias[5].f}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-left:auto;align-items:center">
        <!-- Filtro por ejecutivo -->
        <select style="padding:6px 10px;border:1.5px solid var(--line);border-radius:8px;font-size:12px;
               background:var(--surface);color:var(--text);min-width:160px"
          onchange="window.agendaEjFiltro=this.value;go('agendaEquipo')">
          <option value="">Todos los ejecutivos</option>
          ${todosEjs.map(e=>{
            const l=logroEj(e.n);
            const col=colorLogro(l);
            return `<option value="${esc(e.n)}" ${fEj===e.n?'selected':''}>${esc(e.n)} (${Math.round(l*100)}%)</option>`;
          }).join('')}
        </select>
        <button class="act o sm" ${fEj?'':'style="opacity:.4;cursor:default"'}
          onclick="${fEj?`window.agendaEjFiltro='';go('agendaEquipo')`:''}">✕ Limpiar filtros</button>
        <button class="act o sm" onclick="window.semOffset=(window.semOffset||0)-1;go('agendaEquipo')">← Anterior</button>
        <button class="act o sm" onclick="window.semOffset=0;go('agendaEquipo')">Esta semana</button>
        <button class="act o sm" onclick="window.semOffset=(window.semOffset||0)+1;go('agendaEquipo')">Siguiente →</button>
      </div>
    </div>`

  // KPIs del equipo o del ejecutivo filtrado
  +`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px">
      ${[
        {k:'Ejecutivos visibles', v:ejsVis.length, ic:'👥'},
        {k:'Grupos programados',  v:[...new Set(todasCitas.map(a=>a.grupo))].length, ic:'📋',
         sub:todasCitas.length+' citas total'},
        {k:'Cobertura promedio',
         v:(ejsVis.reduce((a,e)=>{
           const grupos=[...new Set(DB.cuentas.filter(c=>c.ejecutivo===e.n).map(c=>c.grupo))].filter(Boolean);
           const citas=DB.agenda.filter(a=>a.ejecutivo===e.n&&a.semana===sem);
           return a+(grupos.length?citas.length/grupos.length:0);
         },0)/Math.max(1,ejsVis.length)*100).toFixed(0)+'%',ic:'📊'},
        {k:'Visitas realizadas',
         v:todasCitas.filter(a=>a.hecha).length+' / '+todasCitas.length, ic:'✅',
         sub:`${todasCitas.length-todasCitas.filter(a=>a.hecha).length} pendientes`},
      ].map(k=>`<div style="background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 16px">
        <div style="font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">${k.ic} ${k.k}</div>
        <div style="font-size:22px;font-weight:800;color:var(--indigo)">${k.v}</div>
        ${k.sub?`<div style="font-size:10.5px;color:var(--text3);margin-top:3px">${k.sub}</div>`:''}
      </div>`).join('')}
    </div>`

  // Vista consolidada: una columna por día, todas las citas de todos los ejecutivos
  +`<div class="panel" style="padding:0;overflow:hidden">
      <div style="display:grid;grid-template-columns:repeat(6,1fr);border-bottom:2px solid var(--line)">
        ${NOM.map((d,i)=>{
          const citas=todasCitas.filter(a=>a.dia===i+1);
          const esHoy=Math.abs(dias[i].fecha-HOY)<86400000;
          return `<div style="padding:10px;text-align:center;
                    background:${esHoy?'var(--tint)':'transparent'};
                    border-right:${i<5?'1px solid var(--line)':'none'}">
            <div style="font-size:10px;font-weight:700;color:${esHoy?'var(--turq)':'var(--text3)'};
                 text-transform:uppercase;letter-spacing:.5px">${d}</div>
            <div style="font-size:18px;font-weight:800;color:${esHoy?'var(--turq)':'var(--indigo)'};margin:2px 0">${dias[i].fecha.getDate()}</div>
            <div style="display:flex;justify-content:center;gap:3px;flex-wrap:wrap;margin-top:4px">
              ${citas.map(()=>`<span style="width:7px;height:7px;border-radius:50%;background:${esHoy?'var(--turq)':'var(--indigo)'}"></span>`).join('')}
              ${!citas.length?`<span style="width:7px;height:7px;border-radius:50%;background:var(--line)"></span>`:''}
            </div>
          </div>`;}).join('')}
      </div>
      <!-- Cuerpo del calendario: cada cita agrupa ejecutivo + grupo -->
      <div style="display:grid;grid-template-columns:repeat(6,1fr);min-height:260px">
        ${NOM.map((d,i)=>{
          const citas=todasCitas.filter(a=>a.dia===i+1);
          const esHoy=Math.abs(dias[i].fecha-HOY)<86400000;
          return `<div style="padding:8px;border-right:${i<5?'1px solid var(--line2)':'none'};
                    background:${esHoy?'rgba(25,156,154,.04)':'transparent'};
                    border-top:1px solid var(--line2);min-height:240px">
            ${citas.length
              ? citas.map(a=>{
                  const grp=DB.cuentas.filter(c=>c.grupo===a.grupo&&c.ejecutivo===(a.ejecutivo||''));
                  const ejNombre=a.ejecutivo||'—';
                  const ejAbrev=ejNombre.split(' ').map(x=>x[0]).join('').slice(0,2);
                  const colEj=colorLogro(logroEj(ejNombre));
                  return `<div style="margin-bottom:8px;border-radius:9px;overflow:hidden;
                       border:1.5px solid ${a.hecha?'var(--green)':'var(--turq)'};
                       background:${a.hecha?'rgba(30,142,90,.06)':'var(--surface)'}">
                    <div style="background:${a.hecha?'var(--green)':'var(--turq)'};
                         padding:3px 7px;font-size:9px;font-weight:700;color:#fff;
                         display:flex;justify-content:space-between;align-items:center">
                      <span>${a.hora}</span>
                      <span>${a.hecha?'✓':'●'}</span>
                    </div>
                    <div style="padding:6px 8px">
                      <div style="font-size:11px;font-weight:700;color:var(--indigo);line-height:1.3">${esc(a.grupo)}</div>
                      ${!fEj?`<div style="display:inline-flex;align-items:center;gap:4px;margin-top:3px">
                        <span style="width:18px;height:18px;border-radius:50%;background:${colEj};
                             display:inline-flex;align-items:center;justify-content:center;
                             font-size:8px;font-weight:800;color:#fff">${ejAbrev}</span>
                        <span style="font-size:9.5px;color:var(--text3)">${esc(ejNombre.split(' ')[0])}</span>
                      </div>`:''}
                      ${grp.length?`<div style="font-size:9.5px;color:var(--text3);margin-top:2px">${grp.length} cliente${grp.length!==1?'s':''}</div>`:''}
                    </div>
                  </div>`;}).join('')
              : `<div style="height:100%;display:flex;align-items:center;justify-content:center;padding:16px 0;opacity:.4">
                  <div style="text-align:center;color:var(--text3)">
                    <div style="font-size:18px">○</div>
                    <div style="font-size:10px;margin-top:4px">Sin visita</div>
                  </div>
                </div>`}
          </div>`;}).join('')}
      </div>
    </div>`

  // Grupos sin visita programada
  +(()=>{
    const todosGrupos=[...new Set(
      ejsVis.flatMap(e=>DB.cuentas.filter(c=>c.ejecutivo===e.n).map(c=>c.grupo))
    )].filter(Boolean);
    const gruposSin=todosGrupos.filter(g=>!todasCitas.some(a=>a.grupo===g));
    if(!gruposSin.length) return `<div class="note ok" style="margin-top:14px">
      Todos los grupos tienen al menos una visita programada esta semana.</div>`;
    const ESC=P('DIAS_MORA_ESCALACION');
    return `<div class="note warn" style="margin-top:14px">
      <b>${gruposSin.length} grupo${gruposSin.length>1?'s':''} sin visita programada esta semana:</b>
      ${gruposSin.map(g=>{
        const cs=DB.cuentas.filter(c=>c.grupo===g&&ejsVis.some(e=>e.n===c.ejecutivo));
        const maxMora=Math.max(0,...cs.map(c=>c.diasVenc));
        const ejG=cs[0]?.ejecutivo||'—';
        return `<span style="display:inline-block;margin:3px 4px;padding:2px 9px;border-radius:20px;
          font-size:11px;font-weight:600;background:${maxMora>ESC?'rgba(192,57,43,.1)':'var(--bg)'};
          color:${maxMora>ESC?'var(--red)':'var(--text2)'}">
          ${esc(g)}${!fEj?' ('+esc(ejG.split(' ')[0])+')':''} ${cs.length} clientes${maxMora>ESC?', mora >'+ESC+'d':''}
        </span>`;}).join('')}
    </div>`;
  })()

  +`<div style="font-size:10.5px;color:var(--text3);margin-top:12px;text-align:right">
      Vista de solo lectura · La agenda la gestiona cada ejecutivo desde su perfil
    </div>`;
};


VIEWS.tabJefe=()=>{
  const persona=ROLES.jefatura.persona;
  if(typeof window.tjFiltroEj==='undefined') window.tjFiltroEj='';
  if(typeof window.tjFiltroMarca==='undefined') window.tjFiltroMarca='';
  if(typeof window.tjFiltroRegion==='undefined') window.tjFiltroRegion='';
  const fTJEj=window.tjFiltroEj||'', fTJMarca=window.tjFiltroMarca||'', fTJRegion=window.tjFiltroRegion||'';
  const eqBase=equipo();
  /* Los 3 filtros de arriba ahora sí afectan todo lo que sigue: KPIs, ranking, alertas,
     salud del equipo y compromisos. Ejecutivo es exacto; Marca/Región se prorratean
     sobre recuperado/meta (ver aplicarFiltroEquipo) y filtran cuentas de forma exacta. */
  const eq=aplicarFiltroEquipo(eqBase, fTJEj, fTJMarca, fTJRegion);
  const nombresEq=new Set(eq.map(e=>e.n));
  const jef=DB.jefaturas.find(x=>x.n===persona)||{};
  const cs=DB.cuentas.filter(c=>c.jefatura===persona && nombresEq.has(c.ejecutivo)
    &&(!fTJMarca||c.marca===fTJMarca)&&(!fTJRegion||c.region===fTJRegion));
  /* meta/rec siempre se derivan del equipo real (eq), nunca del agregado estático de
     DB.jefaturas — ese campo puede quedar desactualizado si el equipo cambia (ya ocurrió:
     seguía sumando a un ejecutivo que ahora reporta a otra jefatura). */
  const meta=eq.reduce((s,e)=>s+e.meta,0)||1;
  const rec=eq.reduce((s,e)=>s+e.recuperado,0);
  const logro=meta?rec/meta:0;
  const dr=diasRestantes();
  const transc=P('DURACION_CATORCENA')-dr;
  const proy=transc>0?Math.round(rec/transc*P('DURACION_CATORCENA')):rec;
  const ritmoReq=dr>0?Math.max(0,Math.round((meta-rec)/dr)):0;
  const ritmoAct=transc>0?Math.round(rec/transc):0;
  const faltante=Math.max(0,meta-rec);
  const idsCar=new Set(cs.map(c=>c.id));
  const conGest=new Set(DB.gestiones.map(g=>g.cuentaId));
  /* A-05: acotados al equipo de la jefatura en sesión y sensibles a los filtros activos.
     Antes contaban registros de TODO el sistema, incluidos los de otras jefaturas. */
  const _nomEq=new Set(eq.map(e=>e.n));
  const dictPend=DB.dictaminaciones.filter(d=>d.estado==='PENDIENTE_VOBO' && _nomEq.has(d.ejecutivo));
  /* Un FALCO sin asignar no tiene ejecutivo, así que se acota por la región de la
     jefatura (las regiones que su equipo atiende) y por el filtro de región activo. */
  const _regEq=new Set(DB.cuentas.filter(c=>_nomEq.has(c.ejecutivo)).map(c=>c.region));
  const falcoSin=DB.falcos.filter(f=>!f.ejec && f.estatus==='RECIBIDO'
    && _regEq.has(f.region) && (!fTJRegion||f.region===fTJRegion));

  // Compromisos próximos (promesas y convenios del equipo, próximos 15 días)
  const proms=DB.gestiones.filter(g=>['Promesa de pago','Convenio'].includes(g.tipo)
    &&g.compromiso&&g.estado!=='RECHAZADA'&&idsCar.has(g.cuentaId))
    .map(g=>{const cu=cs.find(c=>c.id===g.cuentaId);return {...g,cu,dias:diasHasta(g.compromiso)};})
    .filter(x=>x.cu&&x.dias!==null&&x.dias<=15).sort((a,b)=>a.dias-b.dias);

  // Alertas de atención requerida
  const atencion=[];
  eq.filter(e=>e.pctv<P('UMBRAL_LOGRO_RIESGO')).forEach(e=>atencion.push({tipo:'critica',ej:e,
    msg:`${Math.round(e.pctv)}% de cumplimiento`,
    detalle:`Faltante ${fmt(Math.max(0,e.meta-e.recuperado))}`,accion:'Revisar cartera',
    onclick:`go('carteraEquipo');toggleEj('${esc(e.n)}')`}));
  eq.filter(e=>e.pctv>=P('UMBRAL_LOGRO_RIESGO')&&e.pctv<P('UMBRAL_ALERTA_JEFATURA')).forEach(e=>atencion.push({tipo:'warn',ej:e,
    msg:`${Math.round(e.pctv)}% de cumplimiento`,
    detalle:`Faltante ${fmt(Math.max(0,e.meta-e.recuperado))}`,accion:'Revisar gestión',
    onclick:`go('carteraEquipo');toggleEj('${esc(e.n)}')`}));

  // Salud del equipo
  const enObj=eq.filter(e=>e.pctv>=P('UMBRAL_LOGRO_OBJETIVO')).length;
  const enRiesgo=eq.filter(e=>e.pctv>=P('UMBRAL_LOGRO_RIESGO')&&e.pctv<P('UMBRAL_LOGRO_OBJETIVO')).length;
  const bajObj=eq.filter(e=>e.pctv<P('UMBRAL_LOGRO_RIESGO')).length;
  const saludMsg=enObj>=eq.length*.6?'Equipo en objetivo':'Equipo requiere intervención';
  const saludOk=enObj>=eq.length*.6;

  // Ranking ejecutivos (todos, no solo top/bot)
  const eqRank=eq.slice().sort((a,b)=>b.pctv-a.pctv);
  const colE=p=>colorLogro(p/100);

  // Evolución semanal simulada (últimos 6 puntos de la catorcena)
  const evDias=transc>0?transc:1;
  const evPuntos=Math.min(6,evDias);
  const evSerie=Array.from({length:evPuntos},(_,i)=>Math.round(rec*(i+1)/evPuntos));
  const evMax=Math.max(meta,proy)*1.1;

  /* ── FILTROS ejecutivo/marca/región ──
     eq/rec/meta/logro/cs ya vienen filtrados desde el inicio de la función
     (vía aplicarFiltroEquipo). Aquí solo se preparan las opciones del dropdown
     y la bandera de "hay filtro activo" para la UI. */
  const hasFiltro=fTJEj||fTJMarca||fTJRegion;
  const marcasOpts=[...new Set(DB.cuentas.map(c=>c.marca))].filter(Boolean).sort();
  const regionesOpts=[...new Set(DB.cuentas.map(c=>c.region))].filter(Boolean).sort();

  return head('Tablero de Jefatura','Jefatura · supervisión del equipo')

  /* ── BARRA DE FILTROS / META ── */

  + `<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--indigo)">
          Catorcena ${DB.catorcenaActual}
          <span style="font-size:11px;font-weight:500;color:var(--text3);margin-left:8px">${dr} días para el cierre</span>
        </div>
        <div style="font-size:10.5px;color:var(--text3);margin-top:2px">Actualizado: ${fecha(HOY)}</div>
      </div>
      <div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap;align-items:center">
        <select style="padding:6px 10px;border:1.5px solid var(--line);border-radius:8px;font-size:12px;
               background:var(--surface);color:${fTJEj?'var(--turq)':'var(--text)'}"
          onchange="window.tjFiltroEj=this.value;go('tabJefe')">
          <option value="">Todos los ejecutivos</option>
          ${eqBase.map(e=>`<option value="${esc(e.n)}" ${fTJEj===e.n?'selected':''}>${esc(e.n)}</option>`).join('')}
        </select>
        <select style="padding:6px 10px;border:1.5px solid var(--line);border-radius:8px;font-size:12px;
               background:var(--surface);color:${fTJMarca?'var(--turq)':'var(--text)'}"
          onchange="window.tjFiltroMarca=this.value;go('tabJefe')">
          <option value="">Todas las marcas</option>
          ${marcasOpts.map(m=>`<option value="${esc(m)}" ${fTJMarca===m?'selected':''}>${esc(m)}</option>`).join('')}
        </select>
        <select style="padding:6px 10px;border:1.5px solid var(--line);border-radius:8px;font-size:12px;
               background:var(--surface);color:${fTJRegion?'var(--turq)':'var(--text)'}"
          onchange="window.tjFiltroRegion=this.value;go('tabJefe')">
          <option value="">Todas las regiones</option>
          ${regionesOpts.map(r=>`<option value="${esc(r)}" ${fTJRegion===r?'selected':''}>${esc(r)}</option>`).join('')}
        </select>
        <button class="act o sm" ${hasFiltro?'':'style="opacity:.4;cursor:default"'}
          onclick="${hasFiltro?`window.tjFiltroEj=window.tjFiltroMarca=window.tjFiltroRegion='';go('tabJefe')`:''}">
          ✕ Limpiar filtros
        </button>
        <div style="font-size:11px;color:var(--text3)">
          ${eq.length} ejecutivo${eq.length!==1?'s':''} · ${cs.length} cuentas
        </div>
      </div>
    </div>`
  + chipsFiltros([['Ejecutivo',fTJEj],['Marca',fTJMarca],['Región',fTJRegion]], "window.tjFiltroEj=window.tjFiltroMarca=window.tjFiltroRegion='';go('tabJefe')")
  + (eq.length===0 ? estadoVacioFiltro("window.tjFiltroEj=window.tjFiltroMarca=window.tjFiltroRegion='';go('tabJefe')") : ''
  + ((fTJMarca||fTJRegion)?`<div class="note warn" style="margin-bottom:16px">
      <b>Nota sobre el filtro de ${fTJMarca&&fTJRegion?'marca y región':fTJMarca?'marca':'región'}:</b> Recuperado y Meta son un estimado proporcional al saldo de cartera que coincide con el filtro — el sistema no registra el recuperado desglosado por marca o región. Cartera y Distribución sí son exactos.
    </div>`:'')

  /* ── HERO CARDS — 6 columnas como en la referencia ── */
  + `<div class="heroGrid6" style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px">

      <!-- 1. Recuperado -->
      <div class="dashCard primary" style="grid-column:span 1">
        <div class="dcAccent"></div><div class="dcAccent2"></div>
        <div class="dck">Recuperado 💰${hasFiltro?'<span style="font-size:10px;opacity:.7;margin-left:6px">filtrado</span>':''}</div>
        <div class="dcv">${fmt(rec)}</div>
        <div class="progHero"><i style="width:${Math.min(100,logro*100)}%"></i></div>
        <div class="dcs">${pct(logro)} de ${fmt(meta)} · C${DB.catorcenaActual}</div>
      </div>

      <!-- 2. Proyección al cierre -->
      ${(()=>{const proy=transc>0?Math.round(rec/transc*P('DURACION_CATORCENA')):rec;return `
      <div class="dashCard turq" style="grid-column:span 1">
        <div class="dcAccent"></div><div class="dcAccent2"></div>
        <div class="dck">Proyección al cierre 📈</div>
        <div class="dcv">${fmt(proy)}</div>
        <div class="dcs">${proy>=meta?'+'+pct((proy-meta)/meta)+' vs meta':'⚠ Por debajo de la meta'}</div>
      </div>`})()}

      <!-- 3. Cumplimiento -->
      ${(fTJMarca||fTJRegion)
        ? `<div class="dashCard lite" style="grid-column:span 1;display:flex;flex-direction:column;justify-content:center">
          <div class="dck" style="color:var(--text3)">Cumplimiento 🎯</div>
          <div style="font-size:12.5px;font-weight:700;color:var(--text3);margin-top:6px;line-height:1.35">No disponible con este filtro</div>
          <div class="dcs" style="color:var(--text3);margin-top:4px">El recuperado no se registra desglosado por ${fTJMarca&&fTJRegion?'marca ni región':fTJMarca?'marca':'región'}, así que el porcentaje no puede variar. Quita el filtro para verlo.</div>
        </div>`
        : `<div class="dashCard ${claseLogro(logro)}" style="grid-column:span 1">
        <div class="dcAccent"></div><div class="dcAccent2"></div>
        <div class="dck">Cumplimiento 🎯</div>
        <div class="dcv">${pct(logro)}</div>
        <div class="dcs">vs meta 100%</div>
      </div>`}

      <!-- 4. Faltante para meta -->
      ${(()=>{const faltante=Math.max(0,meta-rec);return `
      <div class="dashCard lite" style="grid-column:span 1;position:relative">
        <div style="position:absolute;right:14px;top:14px;font-size:20px">🚩</div>
        <div class="dck" style="color:var(--text3)">Faltante para meta</div>
        <div class="dcv" style="color:${faltante>0?'var(--red)':'var(--green)'}">${fmt(faltante)}</div>
        <div class="dcs" style="color:var(--text3)">Para alcanzar ${fmt(meta)}</div>
      </div>`})()}

      <!-- 5. Cartera asignada -->
      <div class="dashCard lite" style="grid-column:span 1;position:relative">
        <div style="position:absolute;right:14px;top:14px;font-size:20px">👥</div>
        <div class="dck" style="color:var(--text3)">Cartera asignada</div>
        <div class="dcv" style="color:var(--indigo)">${cs.length}</div>
        <div class="dcs" style="color:var(--text3)">Cuentas · ${fmt(cs.reduce((a,c)=>a+c.saldoReal,0))}</div>
      </div>

      <!-- 6. Por autorizar -->
      <div class="dashCard lite" style="grid-column:span 1;position:relative;cursor:pointer" onclick="go('dictJefe')">
        <div style="position:absolute;right:14px;top:14px;font-size:20px">📋</div>
        <div class="dck" style="color:var(--text3)">Por resolver</div>
        <div class="dcv" style="color:${dictPend.length?'var(--amber)':'var(--green)'}">${dictPend.length}</div>
        <div class="dcs" style="color:${dictPend.length?'var(--amber)':'var(--text3)'}">
          ${dictPend.length?'Dictaminaciones pendientes':'Sin pendientes ✓'}
        </div>
      </div>
    </div>`

  /* ── SEGUNDA FILA: Salud equipo + Alertas + Compromisos ── */
  + `<div class="tabJefeRow2" style="display:grid;grid-template-columns:1fr 1.4fr 1.4fr;gap:14px;margin-bottom:20px">

      <!-- Salud del equipo -->
      <div class="panel" style="margin:0">
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:14px">Salud del equipo</div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="width:48px;height:48px;border-radius:50%;
               background:${saludOk?'var(--green)':'var(--amber)'};
               display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
            ${saludOk?'✓':'⚠'}
          </div>
          <div>
            <div style="font-size:14px;font-weight:800;color:${saludOk?'var(--green)':'var(--amber)'}">${saludMsg}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:2px">
              ${enObj} de ${eq.length} ejecutivos cumplen ≥ ${uObjetivoPct()}% de la meta
            </div>
          </div>
        </div>
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Distribución del equipo</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          ${[
            {n:enObj,  l:'En objetivo',  sub:`≥ ${uObjetivoPct()}%`, col:'var(--green)'},
            {n:enRiesgo,l:'En riesgo',   sub:`${uRiesgoPct()}–${uObjetivoPct()-1}%`,col:'var(--amber)'},
            {n:bajObj, l:'Bajo objetivo',sub:`< ${uRiesgoPct()}%`,  col:'var(--red)'},
          ].map(b=>`<div style="text-align:center;padding:10px 6px;border-radius:10px;
               background:${b.n?b.col+'18':'var(--bg)'};border:1.5px solid ${b.n?b.col:'var(--line)'}">
            <div style="font-size:22px;font-weight:900;color:${b.n?b.col:'var(--text3)'}">${b.n}</div>
            <div style="font-size:10px;font-weight:700;color:${b.n?b.col:'var(--text3)'};margin-top:2px">${b.l}</div>
            <div style="font-size:9px;color:var(--text3)">${b.sub}</div>
          </div>`).join('')}
        </div>
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line);
             display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <div style="font-size:11px;color:var(--text3)">Recuperación prom.</div>
          <div style="font-size:12px;font-weight:700;color:var(--indigo);text-align:right">${fmt(Math.round(rec/Math.max(1,eq.length)))}</div>
          <div style="font-size:11px;color:var(--text3)">Cuentas prom.</div>
          <div style="font-size:12px;font-weight:700;color:var(--indigo);text-align:right">${Math.round(cs.length/Math.max(1,eq.length))}</div>
        </div>
      </div>

      <!-- Atención requerida -->
      <div class="panel" style="margin:0">
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:14px">
          ${atencion.length?`⚠️ Atención requerida`:'✅ Sin alertas críticas'}
        </div>
        ${atencion.length
          ? atencion.slice(0,3).map(a=>`
            <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--line2)">
              <div style="width:36px;height:36px;border-radius:50%;flex-shrink:0;
                   background:${a.tipo==='critica'?'var(--red-bg)':'var(--amber-bg)'};
                   display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;
                   color:${a.tipo==='critica'?'var(--red)':'var(--amber)'};letter-spacing:-.5px">
                ${a.ej.n.split(' ').map(x=>x[0]).join('').slice(0,2)}
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12.5px;font-weight:700;color:var(--indigo)">${esc(a.ej.n)}</div>
                <div style="font-size:11px;color:${a.tipo==='critica'?'var(--red)':'var(--amber)'};">${a.msg}</div>
                <div style="font-size:10.5px;color:var(--text3)">${a.detalle}</div>
              </div>
              <button class="act sm o" onclick="${a.onclick}" style="flex-shrink:0">${a.accion}</button>
            </div>`).join('')
          : `<div style="display:flex;align-items:center;gap:12px;padding:16px 0;color:var(--text3)">
              <span style="font-size:32px">🎉</span>
              <div>
                <div style="font-size:13px;font-weight:700;color:var(--green)">Todo el equipo en objetivo</div>
                <div style="font-size:11px;margin-top:2px">Ningún ejecutivo está por debajo del 65% de cumplimiento</div>
              </div>
            </div>`}
        ${atencion.length>0&&proms.filter(p=>p.dias<=5).length>0?`
          <div style="margin-top:10px;padding:8px 12px;border-radius:9px;background:var(--tint);
               display:flex;align-items:center;gap:8px;cursor:pointer" onclick="go('agendaEquipo')">
            <span style="font-size:16px">📅</span>
            <div>
              <div style="font-size:11.5px;font-weight:700;color:var(--turq)">
                ${proms.filter(p=>p.dias<=5).length} compromiso${proms.filter(p=>p.dias<=5).length>1?'s':''} vence${proms.filter(p=>p.dias<=5).length===1?'':'n'} en 5 días
              </div>
              <div style="font-size:10px;color:var(--text3)">Monto total ${fmt(proms.filter(p=>p.dias<=5).reduce((a,g)=>a+(g.monto||g.cu?.saldoReal||0),0))}</div>
            </div>
            <span style="margin-left:auto;font-size:18px;color:var(--turq)">›</span>
          </div>`:''}
        ${falcoSin.length>0?`
          <div style="margin-top:8px;padding:8px 12px;border-radius:9px;background:#FEF3C7;
               display:flex;align-items:center;gap:8px;cursor:pointer" onclick="go('falcoAsig')">
            <span style="font-size:16px">📮</span>
            <div style="font-size:11.5px;font-weight:700;color:var(--amber)">
              ${falcoSin.length} FALCO sin asignar — ${fmt(falcoSin.reduce((a,f)=>a+f.adeudo,0))}
            </div>
            <span style="margin-left:auto;color:var(--amber)">›</span>
          </div>`:''}
      </div>

      <!-- Próximos compromisos de pago -->
      <div class="panel" style="margin:0">
        <div style="display:flex;align-items:center;margin-bottom:14px">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">Próximos compromisos de pago</div>
          <button class="act o sm" onclick="go('carteraEquipo')" style="margin-left:auto;font-size:10px">Ver todos</button>
        </div>
        ${proms.length
          ? `<div style="font-size:10.5px;font-weight:600;color:var(--text3);
                  display:grid;grid-template-columns:1fr 70px 60px 60px;gap:6px;
                  padding-bottom:6px;border-bottom:1px solid var(--line);margin-bottom:6px">
              <span>Cliente / Ejecutivo</span><span style="text-align:right">Monto</span>
              <span style="text-align:right">Vence en</span><span style="text-align:center">Estado</span>
             </div>
             ${proms.slice(0,5).map(p=>{
               const estado=p.dias<0?'Vencido':p.dias<=P('DIAS_COMPROMISO_URGENTE')?'Urgente':p.dias<=P('DIAS_COMPROMISO_PROXIMO')?'Próximo':'En fecha';
               const cls=p.dias<0?'a':p.dias<=3?'a':p.dias<=7?'m':'g';
               return `<div style="display:grid;grid-template-columns:1fr 70px 60px 60px;gap:6px;
                    align-items:center;padding:6px 0;border-bottom:1px solid var(--line2)">
                 <div style="min-width:0">
                   <div style="font-size:11.5px;font-weight:700;color:var(--indigo);
                        overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.cu.cliente)}</div>
                   <div style="font-size:10px;color:var(--text3)">${esc(p.cu.ejecutivo)}</div>
                 </div>
                 <div style="font-size:12px;font-weight:700;color:var(--indigo);text-align:right">${fmt(p.monto||p.cu.saldoReal)}</div>
                 <div style="font-size:11px;color:var(--text3);text-align:right">${p.dias<0?Math.abs(p.dias)+' venc.':p.dias+' días'}</div>
                 <div style="text-align:center"><span class="pill ${cls}" style="font-size:9px">${estado}</span></div>
               </div>`;}).join('')}
             ${proms.length>5?`<div style="font-size:10.5px;color:var(--text3);text-align:center;padding:8px">
               +${proms.length-5} compromisos más</div>`:''}
             <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line);
                  display:flex;justify-content:space-between;font-size:11px">
               <span style="color:var(--text3)">Total compromisos próximos</span>
               <span style="font-weight:700;color:var(--indigo)">${fmt(proms.reduce((a,g)=>a+(g.monto||g.cu?.saldoReal||0),0))}</span>
             </div>`
          : `<div class="empty">Sin compromisos próximos esta catorcena.</div>`}
      </div>
    </div>`

  /* ── TERCERA FILA: Distribución de cartera + Evolución visual ── */
  + `<div class="tabJefeRow3" style="display:grid;grid-template-columns:1.1fr 1fr;gap:14px;margin-bottom:20px">

      <!-- Distribución de la cartera -->
      <div class="panel" style="margin:0">
        <div style="display:flex;align-items:center;margin-bottom:14px">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">Distribución de la cartera</div>
          <div style="margin-left:auto;font-size:11px;color:var(--text3)">Total: ${fmt(cs.reduce((a,c)=>a+c.saldoReal,0))}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto auto;gap:8px 12px;align-items:center;
             font-size:11px;font-weight:600;color:var(--text3);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--line)">
          <span></span><span style="text-align:right">Monto</span><span style="text-align:right">%</span>
        </div>
        ${CATALOGOS.ESTATUS_CUENTA.map(est=>{
          const cts=cs.filter(c=>c.estatus===est);
          const sd=cts.reduce((a,c)=>a+c.saldoReal,0);
          const tot=cs.reduce((a,c)=>a+c.saldoReal,0)||1;
          const pct2=Math.round(sd/tot*100);
          const col=({'Liquidado':'var(--green)','En gestión':'var(--turq)',
                      'Con promesa vigente':'var(--amber)','Convenio activo':'var(--violet)',
                      'Dictaminación propuesta':'var(--violet)','Quebranto':'var(--red)',
                      'Liquidado pendiente Core':'var(--turql)'})[est]||'var(--text3)';
          return `<div style="display:grid;grid-template-columns:1fr auto auto;gap:8px 12px;
               align-items:center;padding:7px 0;border-bottom:1px solid var(--line2)">
            <div style="display:flex;align-items:center;gap:8px;min-width:0">
              <span style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0"></span>
              <div style="min-width:0">
                <div style="font-size:12px;font-weight:600;color:var(--indigo);
                     overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${est}</div>
                <div class="miniProg" style="width:90px">
                  <i style="width:${pct2}%;background:${col}"></i>
                </div>
              </div>
            </div>
            <div style="font-size:12px;font-weight:700;color:var(--indigo);text-align:right;white-space:nowrap">${fmt(sd)}</div>
            <div style="font-size:11px;color:var(--text3);text-align:right;white-space:nowrap;min-width:40px">${pct2}%</div>
          </div>`;}).join('')}
        <div style="margin-top:10px;text-align:right">
          <button class="act o sm" onclick="go('carteraEquipo')">Ver detalle de cartera</button>
        </div>
      </div>

      <!-- Evolución de recuperación (sparkline visual) -->
      <div class="panel" style="margin:0">
        <div style="display:flex;align-items:center;margin-bottom:4px">
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">Evolución de recuperación</div>
            <div style="font-size:10.5px;color:var(--text3);margin-top:2px">Acumulado en catorcena ${DB.catorcenaActual}</div>
          </div>
        </div>
        <!-- Gráfica SVG del avance diario simulado -->
        <div style="position:relative;height:160px;margin:16px 0 8px">
          ${(()=>{
            const W=440,H=140,PAD=8;
            const puntos=evSerie;
            const maxV=Math.max(meta,Math.max(...puntos))*1.1||1;
            const xs=puntos.map((_,i)=>PAD+i*(W-PAD*2)/(Math.max(1,puntos.length-1)));
            const ys=puntos.map(v=>H-PAD-(v/maxV)*(H-PAD*2));
            // Línea meta
            const metaY=H-PAD-(meta/maxV)*(H-PAD*2);
            const path='M'+xs.map((x,i)=>`${x.toFixed(0)},${ys[i].toFixed(0)}`).join(' L');
            const areaPath=`${path} L${xs[xs.length-1].toFixed(0)},${H} L${PAD},${H} Z`;
            const lastX=xs[xs.length-1],lastY=ys[ys.length-1];
            return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
              <defs>
                <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#199C9A" stop-opacity=".25"/>
                  <stop offset="100%" stop-color="#199C9A" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <!-- Línea de meta -->
              <line x1="${PAD}" y1="${metaY.toFixed(0)}" x2="${W-PAD}" y2="${metaY.toFixed(0)}"
                    stroke="#353266" stroke-width="1.5" stroke-dasharray="5,4" opacity=".4"/>
              <text x="${W-PAD}" y="${(metaY-4).toFixed(0)}" text-anchor="end" font-size="9" fill="#353266" opacity=".5">Meta ${fmt(meta)}</text>
              <!-- Área de relleno -->
              <path d="${areaPath}" fill="url(#evGrad)"/>
              <!-- Línea principal -->
              <polyline points="${xs.map((x,i)=>x.toFixed(0)+','+ys[i].toFixed(0)).join(' ')}"
                        fill="none" stroke="#199C9A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- Punto final con etiqueta -->
              <circle cx="${lastX.toFixed(0)}" cy="${lastY.toFixed(0)}" r="5" fill="#199C9A"/>
              <rect x="${lastX-30}" y="${(lastY-22).toFixed(0)}" width="60" height="18" rx="5" fill="#199C9A"/>
              <text x="${lastX.toFixed(0)}" y="${(lastY-10).toFixed(0)}" text-anchor="middle" font-size="9" font-weight="700" fill="white">${fmt(rec)}</text>
            </svg>`;
          })()}
        </div>
        <!-- Métricas de ritmo -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;
             padding-top:10px;border-top:1px solid var(--line)">
          <div style="background:var(--bg);border-radius:10px;padding:10px 12px">
            <div style="font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px">Ritmo diario actual</div>
            <div style="font-size:18px;font-weight:800;color:var(--indigo);margin-top:2px">${fmt(ritmoAct)}</div>
            <div style="font-size:10px;color:var(--text3)">por día transcurrido</div>
          </div>
          <div style="background:${ritmoReq<=ritmoAct?'rgba(30,142,90,.08)':'rgba(224,138,30,.08)'};
               border-radius:10px;padding:10px 12px;border:1px solid ${ritmoReq<=ritmoAct?'rgba(30,142,90,.2)':'rgba(224,138,30,.2)'}">
            <div style="font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px">Ritmo requerido</div>
            <div style="font-size:18px;font-weight:800;color:${ritmoReq<=ritmoAct?'var(--green)':'var(--amber)'};margin-top:2px">${fmt(ritmoReq)}</div>
            <div style="font-size:10px;color:${ritmoReq<=ritmoAct?'var(--green)':'var(--amber)'};font-weight:600">
              ${ritmoReq<=ritmoAct?'▲ Dentro del ritmo':'▼ Aumentar captación'}
            </div>
          </div>
        </div>

      </div>
    </div>`

  /* ── RANKING DE EJECUTIVOS — tabla enriquecida ── */
  + `<div class="panel">
      <div style="display:flex;align-items:center;margin-bottom:16px">
        <div>
          <span style="font-size:15px;font-weight:800;color:var(--indigo)">Ranking de ejecutivos</span>
          <span style="font-size:11px;font-weight:500;color:var(--text3);margin-left:8px">${eq.length} ejecutivos</span>
        </div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
          <button class="act o sm" onclick="go('carteraEquipo')">Ver cartera completa</button>
        </div>
      </div>
      <!-- Cabecera tabla -->
      <div class="rankEjTbl" style="display:grid;grid-template-columns:32px 1fr 70px 80px 60px 140px 90px 100px 60px;
           gap:8px;align-items:center;padding:0 0 8px;border-bottom:2px solid var(--line);
           font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">
        <span>#</span><span>Ejecutivo</span><span class="rankCol-hide-tab" style="text-align:right">Cuentas</span>
        <span style="text-align:right">Recuperado</span><span class="rankCol-hide-mob" style="text-align:right">Meta</span>
        <span style="text-align:center">Cumplimiento</span>
        <span style="text-align:right">Vs meta</span>
        <span style="text-align:right">Proyección</span>
        <span class="rankCol-hide-mob" style="text-align:center">Tend.</span>
      </div>
      ${eqRank.map((e,i)=>{
        const brecha=e.recuperado-e.meta;
        const proy2=transc>0?Math.round(e.recuperado/transc*P('DURACION_CATORCENA')):e.recuperado;
        const col=colE(e.pctv);
        const medals=['🥇','🥈','🥉'];
        const tend=e.tend>=2?'↗':'↘';
        const tendCol=e.tend>=0?'var(--green)':'var(--red)';
        return `<div class="rankEjTbl" style="display:grid;grid-template-columns:32px 1fr 70px 80px 60px 140px 90px 100px 60px;
             gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line2);
             ${e.pctv<P('UMBRAL_LOGRO_RIESGO')?'background:rgba(192,57,43,.03);border-radius:8px;padding:10px 8px;':''}">
          <!-- Pos -->
          <div style="font-size:${i<3?'18':'13'}px;font-weight:${i<3?'900':'700'};text-align:center;color:var(--text3)">
            ${medals[i]||i+1}
          </div>
          <!-- Nombre -->
          <div style="min-width:0">
            <div style="font-size:12.5px;font-weight:700;color:var(--turq);
                 overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                 cursor:pointer;text-decoration:underline dotted"
              onclick="window.ejAbiertos=window.ejAbiertos||new Set();window.ejAbiertos.add(e.n);go('carteraEquipo')"
              title="Ver cartera de ${esc(e.n)}">${esc(e.n)}</div>
            <div style="font-size:10px;color:var(--text3)">C${DB.catorcenaActual}</div>
          </div>
          <!-- Cuentas -->
          <div class="rankCol-hide-tab" style="font-size:12px;font-weight:600;color:var(--indigo);text-align:right">${cuentasReales(e.n)}</div>
          <!-- Recuperado -->
          <div style="font-size:12px;font-weight:700;color:var(--indigo);text-align:right;white-space:nowrap">${fmt(e.recuperado)}</div>
          <!-- Meta -->
          <div class="rankCol-hide-mob" style="font-size:11px;color:var(--text3);text-align:right;white-space:nowrap">${fmt(e.meta)}</div>
          <!-- Cumplimiento (barra + %) -->
          <div style="display:flex;align-items:center;gap:8px">
            <div class="rankCol-hide-mob" style="flex:1;height:8px;background:var(--bg);border-radius:4px;overflow:hidden">
              <div style="height:100%;width:${Math.min(100,e.pctv)}%;background:${col};border-radius:4px;transition:width .6s"></div>
            </div>
            <span style="font-size:12px;font-weight:800;color:${col};min-width:34px;text-align:right;
                 font-variant-numeric:tabular-nums">${Math.round(e.pctv)}%</span>
          </div>
          <!-- Brecha -->
          <div style="font-size:12px;font-weight:700;color:${brecha>=0?'var(--green)':'var(--red)'};text-align:right;white-space:nowrap">
            ${brecha>=0?'+':''}${fmt(brecha)}
          </div>
          <!-- Proyección al cierre -->
          <div style="text-align:right">
            <div style="font-size:12px;font-weight:700;color:var(--indigo);white-space:nowrap">${fmt(proy2)}</div>
            <div style="font-size:9px;color:${proy2>=e.meta?'var(--green)':'var(--red)'}">
              ${proy2>=e.meta?'↑ Alcanza meta':'↓ Bajo meta'}
            </div>
          </div>
          <!-- Tendencia -->
          <div class="rankCol-hide-mob" style="text-align:center;font-size:18px;color:${tendCol}">${tend}</div>
        </div>`;}).join('')}
    </div>`);
};

VIEWS.carteraEquipo=()=>{
  if(typeof window.ejAbiertos==='undefined') window.ejAbiertos=new Set();
  const ejAbiertos=window.ejAbiertos;
  if(typeof window.fEqQ==='undefined'){window.fEqQ='';window.fEqMarca='';window.fEqRuta='';window.fEqRegion='';window.fEqEst='';}
  const fEqQ=window.fEqQ||'', fEqMarca=window.fEqMarca||'', fEqRuta=window.fEqRuta||'', fEqRegion=window.fEqRegion||'', fEqEst=window.fEqEst||'';
  const eq=equipo();
  const uniq=k=>[...new Set(DB.cuentas.map(c=>c[k]))].sort();
  const todosAbiertos=eq.every(e=>ejAbiertos.has(e.n));
  const filtrarCuentas=ej=>DB.cuentas.filter(c=>c.ejecutivo===ej&&
    (!fEqQ||`${c.cliente} ${c.id} ${c.grupo} ${c.lider}`.toLowerCase().includes(fEqQ.toLowerCase()))&&
    (!fEqMarca||c.marca===fEqMarca)&&(!fEqRuta||c.ruta===fEqRuta)&&
    (!fEqRegion||c.region===fEqRegion)&&(!fEqEst||c.estatus===fEqEst));

  /* E2E-2: el encabezado se deriva del MISMO conjunto que se lista abajo.
     Antes se calculaba aparte con DB.cuentas.filter(c=>c.jefatura===persona), así que
     ignoraba los filtros activos y además usaba el campo cuenta.jefatura en vez de la
     plantilla real (reportaA). Ahora ambos consumen filtrarCuentas(). */
  const _ctasVisibles=eq.flatMap(e=>filtrarCuentas(e.n));
  const totalCtas=_ctasVisibles.length;
  const totalSaldo=_ctasVisibles.reduce((s,c)=>s+c.saldoReal,0);
  const conGestion=new Set(DB.gestiones.map(g=>g.cuentaId));
  const nGest=id=>DB.gestiones.filter(g=>g.cuentaId===id).length;

  return head('Cartera del Equipo','Jefatura · Ejecutivo → Grupos → Cuentas',
    'Navega por ejecutivo, abre el detalle de sus grupos y llega a cada cuenta. Desde aquí puedes acceder al expediente completo.')
  + `<div class="filters">
      <input id="feq" placeholder="Buscar cliente, ID, grupo o líder…" value="${esc(fEqQ)}"
        oninput="fEqQ=this.value;go('carteraEquipo')">
      <select onchange="fEqMarca=this.value;go('carteraEquipo')">
        <option value="">Todas las marcas</option>${uniq('marca').map(m=>`<option ${m===fEqMarca?'selected':''}>${m}</option>`).join('')}</select>
      <select onchange="fEqRuta=this.value;go('carteraEquipo')">
        <option value="">Todas las rutas</option>${uniq('ruta').map(r=>`<option ${r===fEqRuta?'selected':''}>${r}</option>`).join('')}</select>
      <select onchange="fEqRegion=this.value;go('carteraEquipo')">
        <option value="">Todos los estados</option>${uniq('region').map(r=>`<option ${r===fEqRegion?'selected':''}>${r}</option>`).join('')}</select>
      <select onchange="fEqEst=this.value;go('carteraEquipo')">
        <option value="">Todos los estatus</option>${estatusDeRol().map(e=>`<option ${e===fEqEst?'selected':''}>${e}</option>`).join('')}</select>
      <button class="act o" onclick="limpiarFiltrosEq()">Limpiar</button>
    </div>`
  + `<div class="panel">
      <h3>Ejecutivos <span class="pill n">${eq.length} · ${totalCtas} cuentas · ${fmt(totalSaldo)}</span>
        <button class="act o sm" onclick="expandirTodosEj(${todosAbiertos?'false':'true'})">${todosAbiertos?'Contraer todo':'Expandir todo'}</button></h3>
      ${eq.map(e=>{
        const ab=ejAbiertos.has(e.n);
        const cuentasFilt=filtrarCuentas(e.n);
        const logpct=Math.min(100,e.logro*100);
        const col=colorLogro(e.logro);
        return `<div class="grpBlock ${ab?'on':''}">
          <button class="grpHead" aria-expanded="${ab}" onclick="toggleEj('${e.n.replace(/'/g,"\\'")}')">
            <span class="gchev">▸</span>
            <div style="width:36px;height:36px;border-radius:9px;background:${colorLogroBg(logpct/100)};
                 display:flex;align-items:center;justify-content:center;font-size:18px;
                 flex-shrink:0" title="Logro ${Math.round(logpct)}%">${emojiLogro(logpct/100)}</div>
            <div class="gmain" style="flex:1;min-width:0">
              <b>${esc(e.n)}</b>
              <span>${DB.cuentas.filter(c=>c.ejecutivo===e.n).length} cuentas · ${[...new Set(DB.cuentas.filter(c=>c.ejecutivo===e.n).map(c=>c.grupo))].filter(Boolean).length} grupos · ${fmt(DB.cuentas.filter(c=>c.ejecutivo===e.n).reduce((s,c)=>s+c.saldoReal,0))} en gestión</span>
              <div class="miniProg" style="margin-top:4px"><i style="width:${logpct}%;background:${col}"></i></div>
            </div>
            <div class="gstat"><b>${fmt(e.recuperado)}</b><span>recuperado</span></div>
            <div class="gstat"><b>${fmt(e.meta)}</b><span>meta</span></div>
            ${e.sinGestion?`<span class="pill a">${e.sinGestion} sin gestión</span>`:'<span class="pill g">Al día</span>'}
          </button>
          ${ab?`<div class="grpBody">
            ${cuentasFilt.length===0
              ? `<div class="empty">Ninguna cuenta coincide con los filtros.</div>`
              : (()=>{
                  if(typeof window.grpAbEq==='undefined') window.grpAbEq={};
                  const _ejKey=e.n;
                  const gm={};cuentasFilt.forEach(c=>{(gm[c.grupo]??=[]).push(c);});
                  const grupos=Object.entries(gm);
                  const ESC_D=P('DIAS_MORA_ESCALACION');
                   return `<div style="font-size:11px;color:var(--text3);margin:0 0 10px;
                     display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                     <span>${grupos.length} grupo${grupos.length!==1?'s':''} · ${cuentasFilt.length} cuenta${cuentasFilt.length!==1?'s':''}</span>
                     <button class="act o sm" style="font-size:10px;padding:3px 8px"
                       data-ejkey="${_ejKey}" data-goms='${JSON.stringify(Object.keys(gm))}'
                       onclick="(function(b){
                         window.grpAbEq=window.grpAbEq||{};
                         window.grpAbEq[b.dataset.ejkey]=JSON.parse(b.dataset.goms);
                         go('carteraEquipo');
                       })(this)">▾ Expandir grupos</button>
                     <button class="act o sm" style="font-size:10px;padding:3px 8px"
                       data-ejkey="${_ejKey}"
                       onclick="(function(b){
                         window.grpAbEq=window.grpAbEq||{};
                         window.grpAbEq[b.dataset.ejkey]=[];
                         go('carteraEquipo');
                       })(this)">▸ Colapsar</button>
                   </div>
                  ${grupos.map(([gnom,cts])=>{
                    const _gOpen=((window.grpAbEq||{})[_ejKey]||[]).includes(gnom);
                    const _sdoG=cts.reduce((s,c)=>s+c.saldoReal,0);
                    const _maxD=Math.max(...cts.map(c=>c.diasVenc));
                     return `<div class="grpBlock ${_gOpen?'on':''}" style="margin-bottom:6px">
                       <button class="grpHead" style="padding:10px 12px" aria-expanded="${_gOpen}"
                         data-ejkey="${_ejKey}" data-gnom="${gnom.replace(/"/g,'&quot;')}"
                         onclick="(function(b){
                           var ek=b.dataset.ejkey, gn=b.dataset.gnom;
                           window.grpAbEq=window.grpAbEq||{};
                           var arr=[...((window.grpAbEq[ek])||[])];
                           var ii=arr.indexOf(gn);
                           ii>-1?arr.splice(ii,1):arr.push(gn);
                           window.grpAbEq[ek]=arr;
                           go('carteraEquipo');
                         })(this)">
                         <span class="gchev">${_gOpen?'▾':'▸'}</span>
                         <span style="font-size:14px;flex-shrink:0">📍</span>
                         <div class="gmain">
                           <b>${esc(gnom)}</b>
                           <span>${cts.length} cliente${cts.length!==1?'s':''} · ${fmt(_sdoG)}</span>
                         </div>
                         <div class="gstat"><b>${_maxD}</b><span>días max</span></div>
                         <span class="pill ${_maxD>=ESC_D?'a':'g'}" style="font-size:10px">
                           ${_maxD>=ESC_D?'⚠ Mora alta':'Sin mora alta'}
                         </span>
                       </button>
                      </button>
                      ${_gOpen?`<div class="grpBody">
                        ${tabla(['Cuenta','Cliente','Marca','Saldo','Días','Gestiones','Estatus',''],
                          cts.slice().sort((a,b)=>b.diasVenc-a.diasVenc).map(c=>{
                            const nG=nGest(c.id);
                            const valBtn=nG>0&&!tieneVisitaValidada(c.id)
                              ?`<button class="act sm" style="background:var(--green);font-size:10.5px;padding:5px 9px" onclick="validarVisita('${c.id}','${esc(c.cliente).replace(/'/g,"\\'")}')">✓ Validar</button>`:'';
                            return [
                              (c.esFalco?'<span class="pill m" style="font-size:8.5px;padding:2px 6px;margin-right:4px">FALCO</span>':'')+`<b>${c.id}</b>`,
                              esc(c.cliente),
                              c.esFalco?'<span class="pill m">Faltante</span>':esc(c.marca),
                              fmt(c.saldoReal),
                              `<span class="num">${c.diasVenc}</span>`,
                              `<span class="num ${nG===0?'down':''}">${nG}</span>`,
                              pillEstatus(c.estatus),
                              `<div class="btnrow"><button class="act sm o" onclick="go('detalle','${c.id}')">Ver detalle</button>${valBtn}</div>`
                            ];}),980)}
                      </div>`:''}
                    </div>`;
                  }).join('')}`;
                })()}
          </div>`:''}
        </div>`;}).join('')}
    </div>`;
};




if(typeof dictJefeTab==='undefined') window.dictJefeTab='pendientes';
if(typeof dictJefeBusq==='undefined') window.dictJefeBusq='';
VIEWS.dictJefe=()=>{
  const ESTADO_LABEL={
    'PENDIENTE_VOBO':'Pendiente de VoBo',
    'VOBO_JEFATURA':'VoBo otorgado — en Gerencia',
    'RECHAZADA_JEFATURA':'Rechazada por Jefatura',
    'VOBO_GERENCIA':'Aprobada por Gerencia',
    'RECHAZADA_GERENCIA':'Rechazada por Gerencia'
  };
  const ESTADO_PILL={'PENDIENTE_VOBO':'m','VOBO_JEFATURA':'b','RECHAZADA_JEFATURA':'a','VOBO_GERENCIA':'g','RECHAZADA_GERENCIA':'a'};
  /* A-04/A-05: la jefatura NUNCA debe ver dictaminaciones de otro equipo. */
  const _eqJef=new Set(equipo().map(e=>e.n));
  const todas=DB.dictaminaciones.filter(d=>_eqJef.has(d.ejecutivo));
  const pendVobo=todas.filter(d=>d.estado==='PENDIENTE_VOBO');
  const historial=todas.filter(d=>d.estado!=='PENDIENTE_VOBO');
  const tab=window.dictJefeTab||'pendientes';
  const busq=(window.dictJefeBusq||'').toLowerCase().trim();
  const filtrar=arr=>busq?arr.filter(d=>
    d.cliente.toLowerCase().includes(busq)||
    d.cuentaId.toLowerCase().includes(busq)||
    d.ejecutivo.toLowerCase().includes(busq)||
    d.resolucion.toLowerCase().includes(busq)
  ):arr;

  return head('Dictaminaciones','Jefatura · VoBo y firma de autorización',
    'Las dictaminaciones propuestas por los ejecutivos llegan aquí para tu revisión. Otorgar el VoBo las envía a Gerencia para la aprobación final. Rechazarlas las devuelve al ejecutivo con el motivo.')
  + kpi([
      {n:pendVobo.length,l:'Pendientes de tu VoBo',cls:pendVobo.length?'down':'up',d:pendVobo.length?'Requieren revisión':'Sin pendientes'},
      {n:todas.filter(d=>d.estado==='VOBO_JEFATURA').length,l:'En Gerencia'},
      {n:todas.filter(d=>d.estado==='VOBO_GERENCIA').length,l:'Aprobadas',cls:'up'},
      {n:todas.filter(d=>d.estado==='RECHAZADA_JEFATURA').length,l:'Rechazadas por ti'}
    ])
  + (pendVobo.length&&tab==='pendientes'?`<div class="note warn" style="margin-bottom:16px">
      <b>Tienes ${pendVobo.length} dictaminación${pendVobo.length>1?'es':''} esperando tu VoBo.</b>
      Estas propuestas no avanzan a Gerencia hasta que otorgues tu firma de autorización.
    </div>`:'')
  /* ── Buscador ── */
  + `<div class="filters" style="margin-bottom:14px">
      <input id="dictBusqJef" type="search" placeholder="Buscar por cliente, cuenta, ejecutivo o categoría…"
        value="${esc(window.dictJefeBusq||'')}"
        oninput="window.dictJefeBusq=this.value;go('dictJefe')">
      <button class="act o sm" ${busq?'':'style="opacity:.4;cursor:default"'}
        onclick="${busq?`window.dictJefeBusq='';go('dictJefe')`:''}">✕ Limpiar</button>
    </div>`
  /* ── Pestañas ── */
  + `<div role="tablist" aria-label="Filtro de dictaminaciones" style="display:flex;gap:0;border-bottom:2px solid var(--line);margin-bottom:18px">
      <button role="tab" aria-selected="${tab==='pendientes'}" onclick="window.dictJefeTab='pendientes';go('dictJefe')"
        style="padding:9px 20px;font-size:12.5px;font-weight:700;border:none;cursor:pointer;
               background:none;border-bottom:${tab==='pendientes'?'2.5px solid var(--turq)':'2.5px solid transparent'};
               color:${tab==='pendientes'?'var(--turq)':'var(--text3)'};margin-bottom:-2px">
        ⏳ Pendientes de VoBo
        ${pendVobo.length?`<span class="pill a" style="margin-left:6px">${pendVobo.length}</span>`:''}
      </button>
      <button role="tab" aria-selected="${tab==='historial'}" onclick="window.dictJefeTab='historial';go('dictJefe')"
        style="padding:9px 20px;font-size:12.5px;font-weight:700;border:none;cursor:pointer;
               background:none;border-bottom:${tab==='historial'?'2.5px solid var(--turq)':'2.5px solid transparent'};
               color:${tab==='historial'?'var(--turq)':'var(--text3)'};margin-bottom:-2px">
        📋 Historial
        <span class="pill n" style="margin-left:6px">${historial.length}</span>
      </button>
    </div>`
  + (tab==='pendientes'
    ? (filtrar(pendVobo).length
        ? filtrar(pendVobo).map(d=>dictCard(d,ESTADO_LABEL,ESTADO_PILL,true)).join('')
        : `<div class="empty">${busq?'Sin resultados para "'+esc(busq)+'"':'Sin dictaminaciones pendientes de VoBo.'}</div>`)
    : (filtrar(historial).length
        ? filtrar(historial).map(d=>dictCard(d,ESTADO_LABEL,ESTADO_PILL,false)).join('')
        : `<div class="empty">${busq?'Sin resultados para "'+esc(busq)+'"':'Sin historial de dictaminaciones.'}</div>`));
};

function dictCard(d,lbl,pill,acciones,modo){
  const c=DB.cuentas.find(x=>x.id===d.cuentaId)||{};
  const footerAcciones = !acciones
    ? `<div class="dFooter"><button class="act sm o" onclick="go('detalle','${d.cuentaId}')">Ver expediente</button></div>`
    : modo==='gerencia'
    ? `<div class="dFooter">
        <button class="act sm o" onclick="go('detalle','${d.cuentaId}')">Ver expediente</button>
        <button class="act sm r" onclick="dictRechazarGerencia('${d.id}')">Rechazar</button>
        <button class="act sm i" onclick="dictAprobarGerencia('${d.id}')">✓ Aprobar — mover a Quebranto</button>
      </div>`
    : `<div class="dFooter">
        <button class="act sm o" onclick="go('detalle','${d.cuentaId}')">Ver expediente</button>
        <button class="act sm r" onclick="dictRechazar('${d.id}')">Rechazar</button>
        <button class="act sm i" onclick="dictVoBo('${d.id}')">✓ Otorgar VoBo — enviar a Gerencia</button>
      </div>`;
  return `<div class="dictCard">
    <div class="dHead">
      <div style="flex:1;min-width:0">
        <div class="dCliente">${esc(d.cliente)}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${d.cuentaId} · Ejecutivo: ${esc(d.ejecutivo)} · ${d.fecha}</div>
      </div>
      <span class="pill ${pill[d.estado]||'n'}">${lbl[d.estado]||d.estado}</span>
    </div>
    <div class="dMeta">
      <b>Resolución propuesta:</b> ${esc(d.resolucion)}<br>
      <b>Hallazgos:</b> ${esc(d.hallazgos)}
      ${(d.documentos&&d.documentos.length)?`<br><b>Documentos anexos:</b> ${d.documentos.map(esc).join(', ')}`:''}
    </div>
    ${d.motivoRechazo?`<div class="note bad" style="margin-top:10px;margin-bottom:0"><b>Motivo de rechazo:</b> ${esc(d.motivoRechazo)}</div>`:''}
    ${d.historialRechazos&&d.historialRechazos.length?`<div class="note" style="margin-top:8px;margin-bottom:0;font-size:11px">↺ Repropuesta tras ${d.historialRechazos.length} rechazo${d.historialRechazos.length>1?'s':''} anterior${d.historialRechazos.length>1?'es':''}</div>`:''}
    ${footerAcciones}
  </div>`;
}
function dictVoBo(id){
  const d=DB.dictaminaciones.find(x=>x.id===id); if(!d)return;
  modal(`<h3>Otorgar VoBo — ${d.cliente}</h3>
    <div class="msub">${d.cuentaId} · ${d.resolucion}</div>
    <div class="note info" style="margin-bottom:14px">Al otorgar el VoBo, esta dictaminación pasa a Gerencia para la aprobación final. Tú quedarás registrado como autorizante de jefatura.</div>
    <div class="field"><label for="vObs">Observaciones (opcional)</label><textarea id="vObs" placeholder="Comentarios adicionales para Gerencia…"></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act i" onclick="confirmarVoBo('${id}')">Confirmar VoBo y enviar a Gerencia</button></div>`);
}
function confirmarVoBo(id){
  const d=DB.dictaminaciones.find(x=>x.id===id);
  const obs=(document.getElementById('vObs')||{}).value||'';
  d.estado='VOBO_JEFATURA';
  log('VoBo de dictaminación',`${d.id} · ${d.cliente} · ${d.resolucion}`,obs||'Sin observaciones adicionales','PENDIENTE_VOBO','VOBO_JEFATURA');
  closeModal(); toast(`VoBo otorgado. La dictaminación de ${d.cliente} está ahora en Gerencia.`,'ok');
  go('dictJefe');
}
function dictRechazar(id){
  modal(`<h3>Rechazar dictaminación</h3>
    <div class="msub">El motivo es obligatorio. Se regresa al ejecutivo para que complemente la información.</div>
    <div class="field"><label for="rDictCausa">Causa del rechazo</label>
      <select id="rDictCausa">
        <option value="">— Selecciona una causa —</option>
        ${(CATALOGOS.MOTIVO_RECHAZO_DICT||[]).map(m=>`<option>${esc(m)}</option>`).join('')}
      </select>
    </div>
    <div class="field"><label for="rDictMot">Detalle adicional</label><textarea id="rDictMot" placeholder="Ej. Se requieren visitas adicionales documentadas antes de escalar."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act r" onclick="confirmarRechazoDictamen('${id}')">Confirmar rechazo</button></div>`);
}
function confirmarRechazoDictamen(id){
  const causa=(document.getElementById('rDictCausa')||{}).value||'';
  const detalle=(document.getElementById('rDictMot')||{}).value||'';
  if(!causa){toast('Selecciona la causa del rechazo.','bad');return;}
  const mot=causa+(detalle.trim()?' — '+detalle.trim():'');
  const d=DB.dictaminaciones.find(x=>x.id===id);
  d.estado='RECHAZADA_JEFATURA'; d.rechazadoPor='Carmen Vega'; d.motivoRechazo=mot;
  const cu=DB.cuentas.find(x=>x.id===d.cuentaId);
  if(cu&&cu.estatus==='Dictaminación propuesta') cu.estatus='En gestión';
  log('Rechazo de dictaminación',`${d.id} · ${d.cliente}`,mot,'PENDIENTE_VOBO','RECHAZADA_JEFATURA');
  closeModal(); toast(`Dictaminación rechazada. El ejecutivo ${d.ejecutivo} fue notificado.`,'bad');
  go('dictJefe');
}

/* ── Aprobación / rechazo final de Gerencia (cierra el proceso de dictaminación) ── */
function dictAprobarGerencia(id){
  const d=DB.dictaminaciones.find(x=>x.id===id);
  if(!d) return;
  const c=DB.cuentas.find(x=>x.id===d.cuentaId)||cuentasDeFalcos().find(x=>x.id===d.cuentaId);
  modal(`<h3>✓ Aprobar dictaminación ${d.id}</h3>
    <div class="msub">${esc(d.cliente)} · ${d.cuentaId}</div>
    <div class="note bad" style="margin-bottom:14px">
      Esta acción es <b>definitiva</b>: la cuenta pasará a estatus <b>Quebranto</b> y sale del ciclo activo de recuperación.
      No puede deshacerse desde el sistema.
    </div>
    <div class="field"><label for="gAprobObs">Observaciones de tu aprobación (opcional)</label>
      <textarea id="gAprobObs" placeholder="Ej. Se validó el expediente y la documentación anexa. Procede quebranto."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act i" onclick="confirmarAprobacionGerencia('${id}')">Confirmar aprobación final</button></div>`);
}
function confirmarAprobacionGerencia(id){
  const d=DB.dictaminaciones.find(x=>x.id===id);
  const obs=(document.getElementById('gAprobObs')||{}).value||'';
  const estadoAnterior=d.estado;
  d.estado='VOBO_GERENCIA';
  d.aprobadoPor=ROLES[currentRole].persona;
  d.fechaResolucionFinal=fecha(HOY);
  const cu=DB.cuentas.find(x=>x.id===d.cuentaId);
  if(cu){ cu.estatus='Quebranto'; cu.paso=7; }
  log('Aprobación final de dictaminación',`${d.id} · ${d.cliente} · ${d.resolucion}`,
      obs||'Sin observaciones adicionales',estadoAnterior,'VOBO_GERENCIA — cuenta en Quebranto');
  closeModal();
  toast(`Dictaminación aprobada. ${d.cliente} pasa a Quebranto.`,'ok');
  go('dictGer');
}
function dictRechazarGerencia(id){
  modal(`<h3>Rechazar dictaminación (Gerencia)</h3>
    <div class="msub">El motivo es obligatorio. La cuenta regresa a gestión activa y el ejecutivo es notificado.</div>
    <div class="field"><label for="rDictCausaGer">Causa del rechazo</label>
      <select id="rDictCausaGer">
        <option value="">— Selecciona una causa —</option>
        ${(CATALOGOS.MOTIVO_RECHAZO_DICT||[]).map(m=>`<option>${esc(m)}</option>`).join('')}
      </select>
    </div>
    <div class="field"><label for="rDictMotGer">Detalle adicional</label><textarea id="rDictMotGer" placeholder="Ej. El expediente no sustenta la categoría propuesta; se requiere revisión adicional."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act r" onclick="confirmarRechazoDictamenGerencia('${id}')">Confirmar rechazo</button></div>`);
}
function confirmarRechazoDictamenGerencia(id){
  const causa=(document.getElementById('rDictCausaGer')||{}).value||'';
  const detalle=(document.getElementById('rDictMotGer')||{}).value||'';
  if(!causa){toast('Selecciona la causa del rechazo.','bad');return;}
  const mot=causa+(detalle.trim()?' — '+detalle.trim():'');
  const d=DB.dictaminaciones.find(x=>x.id===id);
  const estadoAnterior=d.estado;
  d.estado='RECHAZADA_GERENCIA'; d.rechazadoPor=ROLES[currentRole].persona; d.motivoRechazo=mot;
  const cu=DB.cuentas.find(x=>x.id===d.cuentaId);
  if(cu&&cu.estatus==='Dictaminación propuesta') cu.estatus='En gestión';
  log('Rechazo final de dictaminación',`${d.id} · ${d.cliente}`,mot,estadoAnterior,'RECHAZADA_GERENCIA');
  closeModal(); toast(`Dictaminación rechazada. El ejecutivo ${d.ejecutivo} fue notificado.`,'bad');
  go('dictGer');
}

VIEWS.asignacion=()=>{
  const eq=equipo(); const libres=DB.cuentas.filter(c=>c.estatus!=='Liquidado');
  return head('Asignación de Cartera','Jefatura · distribución',
    `Tres métodos de asignación. El sistema valida el tope de ${P('MAX_CUENTAS_POR_EJECUTIVO')} cuentas por ejecutivo y registra cada movimiento en bitácora con su justificación.`)
  + `<div class="cols3">
      <div class="panel"><h3>1 · Manual</h3>
        <p style="font-size:12px;color:#6b7177;line-height:1.5;margin-bottom:12px">Selección cuenta por cuenta. Útil para casos puntuales o reasignación por conflicto de interés.</p>
        <button class="act" style="width:100%" onclick="asignarManual()">Abrir selección</button></div>
      <div class="panel"><h3>2 · Por grupo</h3>
        <p style="font-size:12px;color:#6b7177;line-height:1.5;margin-bottom:12px">Asigna un grupo solidario completo. Mantiene la relación con el líder y evita duplicar visitas en la misma comunidad.</p>
        <button class="act" style="width:100%" onclick="asignarGrupo()">Abrir selección</button></div>
      <div class="panel"><h3>3 · Automática</h3>
        <p style="font-size:12px;color:#6b7177;line-height:1.5;margin-bottom:12px">El sistema propone distribución balanceando carga, geografía y desempeño reciente. Tú apruebas o ajustas.</p>
        <button class="act" style="width:100%" onclick="asignarAuto()">Ver propuesta</button></div>
    </div>`
  + `<div class="panel"><h3>Carga actual por ejecutivo</h3>
      <div class="funnel">${eq.map(e=>
        `<div class="row"><div class="lab">${esc(e.n)}</div>
         <div class="bar"><i style="width:${Math.min(100,cuentasReales(e.n)/P('MAX_CUENTAS_POR_EJECUTIVO')*100)}%;background:${cuentasReales(e.n)>=P('MAX_CUENTAS_POR_EJECUTIVO')?'var(--red)':'var(--turq)'}"></i></div>
         <div class="val">${cuentasReales(e.n)}/${P('MAX_CUENTAS_POR_EJECUTIVO')}</div></div>`).join('')}</div>
    </div>`
  + `<div class="panel"><h3>Cuentas sin ejecutivo asignado <span class="pill ${libres.filter(c=>!c.ejecutivo||c.ejecutivo==='—').length?'a':'g'}">${libres.filter(c=>!c.ejecutivo||c.ejecutivo==='—').length}</span></h3>
      ${libres.filter(c=>!c.ejecutivo||c.ejecutivo==='—').length
        ? tabla(['ID','Cliente','Grupo','Saldo','Días'],
            libres.filter(c=>!c.ejecutivo||c.ejecutivo==='—').map(c=>[c.id,esc(c.cliente),esc(c.grupo),fmt(c.saldoReal),c.diasVenc]),700)
        : '<div class="empty">Todas las cuentas activas tienen ejecutivo asignado.</div>'}
    </div>`;
};
function asignarManual(){
  const cs=DB.cuentas.filter(c=>c.estatus!=='Liquidado');
  modal(`<h3>Asignación manual</h3><div class="msub">Selecciona las cuentas y el ejecutivo destino.</div>
    <div class="field"><label for="aEjec">Ejecutivo destino</label><select id="aEjec">${DB.ejecutivos.map(e=>`<option>${esc(e.n)}</option>`).join('')}</select></div>
    <div class="field"><label for="aManBusq">Cuentas</label>
      <input id="aManBusq" type="search" placeholder="Buscar cliente, ID o grupo…"
        style="width:100%;margin-bottom:8px;padding:8px 12px;border:1.5px solid var(--line);border-radius:9px;font-size:12.5px"
        oninput="filtrarCuentasManual(this.value)">
      <div id="aManLista" style="max-height:240px;overflow-y:auto;border:1px solid var(--line);border-radius:8px;padding:4px 10px">
        ${cs.map(c=>`<label class="checkline" data-search="${(c.cliente+' '+c.id+' '+c.grupo).toLowerCase()}">
          <input type="checkbox" class="aChk" value="${c.id}">
          <span>${esc(c.cliente)} · ${c.id}<br>
            <span style="font-weight:400;font-size:11px;color:#8a9098">${esc(c.grupo)} · ${fmt(c.saldoReal)} · ${c.diasVenc} días · hoy con ${esc(c.ejecutivo)}</span>
          </span></label>`).join('')}
      </div></div>
    <div class="field"><label for="aMot">Justificación</label><textarea id="aMot" placeholder="Ej. Redistribución por baja del titular de ruta."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="ejecutarAsignacion('Manual')">Asignar</button></div>`,true);
}
function filtrarCuentasManual(q){
  const busq=q.toLowerCase();
  document.querySelectorAll('#aManLista label[data-search]').forEach(el=>{
    el.style.display=el.dataset.search.includes(busq)?'':'none';
  });
}
function asignarGrupo(){
  const grupos=[...new Set(DB.cuentas.filter(c=>c.estatus!=='Liquidado').map(c=>c.grupo))].filter(Boolean).sort();
  modal(`<h3>Asignación por grupo</h3><div class="msub">El grupo solidario completo se traslada a un solo ejecutivo — se respeta la integridad del grupo.</div>
    <div class="field"><label for="aGrupoBusq">Buscar grupo</label>
      <input id="aGrupoBusq" type="search" placeholder="Nombre del grupo o líder…"
        style="width:100%;margin-bottom:8px;padding:8px 12px;border:1.5px solid var(--line);border-radius:9px;font-size:12.5px"
        oninput="filtrarGrupos(this.value)">
      <div id="aGrupoLista" style="max-height:200px;overflow-y:auto;border:1px solid var(--line);border-radius:8px">
        ${grupos.map((g,i)=>{
          const cs=DB.cuentas.filter(c=>c.grupo===g);
          const lider=cs[0]?.lider||'—', ej=cs[0]?.ejecutivo||'—', ruta=cs[0]?.ruta||'—';
          return `<label style="display:flex;align-items:center;gap:10px;padding:9px 12px;
                   border-bottom:1px solid var(--line2);cursor:pointer"
                   data-search="${(g+' '+lider).toLowerCase()}">
            <input type="radio" name="aGrupoSel" value="${g}" ${i===0?'checked':''}
              onchange="resumenGrupo()">
            <div style="flex:1;min-width:0">
              <div style="font-size:12.5px;font-weight:700;color:var(--indigo)">${esc(g)}</div>
              <div style="font-size:11px;color:var(--text3)">${cs.length} cliente${cs.length!==1?'s':''} · Líder: ${esc(lider)} · ${ruta} · Ejecutivo: ${esc(ej)}</div>
            </div>
          </label>`;
        }).join('')}
      </div>
    </div>
    <div id="grpRes"></div>
    <div class="field"><label for="aEjec">Ejecutivo destino</label><select id="aEjec">${DB.ejecutivos.map(e=>`<option>${esc(e.n)}</option>`).join('')}</select></div>
    <div class="field"><label for="aMot">Justificación</label><textarea id="aMot" placeholder="Ej. Concentración de ruta para reducir traslados."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="ejecutarAsignacion('Por grupo')">Asignar grupo completo</button></div>`);
  resumenGrupo();
}
function filtrarGrupos(q){
  const busq=q.toLowerCase();
  document.querySelectorAll('#aGrupoLista label[data-search]').forEach(el=>{
    el.style.display=el.dataset.search.includes(busq)?'':'none';
  });
}
function resumenGrupo(){
  const radio=document.querySelector('input[name="aGrupoSel"]:checked');
  const g=radio?radio.value:(document.getElementById('aGrupo')||{}).value;
  const cs=DB.cuentas.filter(c=>c.grupo===g);
  const el=document.getElementById('grpRes'); if(!el)return;
  el.innerHTML=`<div class="note">El grupo <b>${esc(g)}</b> contiene <b>${cs.length} cuentas</b> por <b>${fmt(cs.reduce((s,c)=>s+c.saldoReal,0))}</b> de saldo real. Líder: <b>${esc(cs[0]?.lider||'—')}</b>. Rutas: ${[...new Set(cs.map(c=>c.ruta))].join(', ')}.</div>`;
}
function asignarAuto(){
  const eq=equipo().slice().sort((a,b)=>a.pctv-b.pctv);

  /* ── Grupos sin ejecutivo asignado ─────────────────────────────────────
     Reglas:
     1. Se asigna el grupo completo (nunca cuentas sueltas)
     2. Se respeta la región del ejecutivo (campo región en cuenta vs alcance del ejecutivo)
     3. Dentro de la región, se prefiere el ejecutivo que ya tiene más grupos de la misma ruta
  ──────────────────────────────────────────────────────────────────────── */
  const sinAsignar=DB.cuentas.filter(c=>!c.ejecutivo&&c.estatus!=='Liquidado');
  const gruposSin=[...new Set(sinAsignar.map(c=>c.grupo))].filter(Boolean);

  // Para cada grupo: determinar ejecutivo recomendado
  const propuestas=gruposSin.map(g=>{
    const ctsGrupo=DB.cuentas.filter(c=>c.grupo===g);
    const ruta=ctsGrupo[0]?.ruta||'';
    const region=ctsGrupo[0]?.region||'';

    // Candidatos: ejecutivos de la región o con cuentas en la misma ruta
    const candidatos=eq.filter(e=>{
      const tieneRegion=DB.cuentas.some(c=>c.ejecutivo===e.n&&(c.region===region||c.ruta===ruta));
      const noSaturado=cuentasReales(e.n)<P('MAX_CUENTAS_POR_EJECUTIVO')-ctsGrupo.length;
      return tieneRegion&&noSaturado;
    });

    // Si no hay candidatos de la región, abrir a todos no saturados
    const pool=candidatos.length?candidatos:eq.filter(e=>cuentasReales(e.n)<P('MAX_CUENTAS_POR_EJECUTIVO')-ctsGrupo.length);

    // Preferir el que ya tiene más grupos de la misma ruta (cercanía)
    const elegido=pool.sort((a,b)=>{
      const rutaA=DB.cuentas.filter(c=>c.ejecutivo===a.n&&c.ruta===ruta).length;
      const rutaB=DB.cuentas.filter(c=>c.ejecutivo===b.n&&c.ruta===ruta).length;
      if(rutaB!==rutaA) return rutaB-rutaA; // más cuentas en la misma ruta
      return a.pctv-b.pctv; // desempate: menor logro (necesita más)
    })[0];

    return {grupo:g, cuentas:ctsGrupo.length, ruta, region,
            lider:ctsGrupo[0]?.lider||'—', saldo:ctsGrupo.reduce((a,c)=>a+c.saldoReal,0),
            ejecutivo:elegido?elegido.n:'Sin candidato disponible', motivo:elegido
              ? candidatos.length
                ? `Región y ruta coinciden (${region} · ${ruta})`
                : `Menor carga disponible — sin ejecutivo de la región`
              : 'Todos los ejecutivos están al tope'};
  });

  // También mostrar resumen de ejecutivos con exceso de carga vs bajo logro
  const propEjs=eq.map(e=>{
    const gruposYa=[...new Set(propuestas.filter(p=>p.ejecutivo===e.n).map(p=>p.grupo))];
    return {...e, gruposPropuestos:gruposYa, cuentasProp:propuestas.filter(p=>p.ejecutivo===e.n).reduce((a,p)=>a+p.cuentas,0)};
  });

  modal(`<h3>Propuesta automática</h3>
    <div class="msub">Balanceo por grupo completo · región · cercanía de ruta · desempeño.</div>
    ${propuestas.length?`
    <div style="background:var(--tint);border-radius:10px;padding:12px 14px;margin-bottom:14px;font-size:12px;color:var(--text2)">
      <b>Reglas aplicadas:</b> (1) Cada grupo se asigna completo · (2) Se respeta la región del ejecutivo ·
      (3) Se prefiere el ejecutivo con más grupos en la misma ruta (cercanía)
    </div>
    <div style="max-height:320px;overflow-y:auto">
      ${propuestas.map(p=>`
        <div style="padding:11px 0;border-bottom:1px solid var(--line2);display:flex;gap:12px;align-items:flex-start">
          <div style="flex:1;min-width:0">
            <div style="font-size:12.5px;font-weight:700;color:var(--indigo)">${esc(p.grupo)}</div>
            <div style="font-size:11px;color:var(--text3)">${p.cuentas} cuenta${p.cuentas!==1?'s':''} · Líder: ${esc(p.lider)} · ${p.ruta} · ${fmt(p.saldo)}</div>
            <div style="font-size:10.5px;color:var(--turq);margin-top:2px">→ ${p.motivo}</div>
          </div>
          <div style="flex-shrink:0;text-align:right">
            <div style="font-size:12px;font-weight:700;color:var(--indigo)">${esc(p.ejecutivo)}</div>
            <div style="font-size:10px;color:var(--text3)">${p.cuentas} cuentas</div>
          </div>
        </div>`).join('')}
    </div>`
    :`<div class="empty">Todas las cuentas activas ya tienen ejecutivo asignado.</div>`}
    <div class="field" style="margin-top:14px"><label for="aMot">Justificación</label>
      <textarea id="aMot">Distribución automática C${DB.catorcenaActual}: grupo completo, región y ruta. ${propuestas.length} grupo${propuestas.length!==1?'s':''} a asignar.</textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Ajustar manualmente</button>
      <button class="act" onclick="ejecutarAsignacionAuto(${JSON.stringify(propuestas).replace(/</g,'\\u003c')})">Aplicar propuesta</button></div>`,true);
}
function ejecutarAsignacionAuto(propuestas){
  const mot=(document.getElementById('aMot')||{}).value||'';
  if(!mot.trim()){toast('La justificación es obligatoria.','bad');return;}
  let n=0;
  propuestas.forEach(p=>{
    if(p.ejecutivo==='Sin candidato disponible') return;
    DB.cuentas.filter(c=>c.grupo===p.grupo&&!c.ejecutivo).forEach(c=>{
      c.ejecutivo=p.ejecutivo; n++;
    });
    const ej=DB.ejecutivos.find(e=>e.n===p.ejecutivo);
    if(ej) ej.cuentas+=p.cuentas;
  });
  log('Asignación automática',`${propuestas.length} grupos · ${n} cuentas`,mot,null,`${n} cuentas asignadas`);
  closeModal();
  toast(`Asignación automática aplicada: ${n} cuenta${n!==1?'s':''} en ${propuestas.length} grupo${propuestas.length!==1?'s':''}.`,'ok');
  go('asignacion');
}
function ejecutarAsignacion(metodo){
  const mot=(document.getElementById('aMot')||{}).value||'';
  if(!mot.trim()){toast('La justificación es obligatoria.','bad');return;}
  const dest=(document.getElementById('aEjec')||{}).value||'distribución balanceada';
  const chks=[...document.querySelectorAll('.aChk:checked')].map(i=>i.value);
  const radioG=document.querySelector('input[name="aGrupoSel"]:checked');
  const grupo=radioG?radioG.value:(document.getElementById('aGrupo')||{}).value;
  let n=0;
  /* ── Validar tope MAX_CUENTAS_POR_EJECUTIVO también en Manual y Por grupo ──
     Antes solo el modo Automática respetaba el tope; Manual y Por grupo asignaban
     sin ningún control, contradiciendo el texto que esta misma pantalla le
     muestra al usuario ("El sistema valida el tope de X cuentas por ejecutivo"). */
  if(metodo==='Manual'||metodo==='Por grupo'){
    const destEj=DB.ejecutivos.find(x=>x.n===dest);
    const tope=P('MAX_CUENTAS_POR_EJECUTIVO');
    const actuales=destEj?destEj.cuentas:0;
    const aAsignar=metodo==='Manual'?chks.length:DB.cuentas.filter(c=>c.grupo===grupo&&c.ejecutivo!==dest).length;
    if(destEj && actuales+aAsignar>tope){
      toast(`${dest} quedaría con ${actuales+aAsignar} cuentas, por encima del tope de ${tope}. Reduce la selección o elige otro ejecutivo.`,'bad');
      return;
    }
  }
  /* A-07: el alcance de región es una restricción dura — no se puede asignar una cuenta
     de una región que el ejecutivo no tiene autorizada. La marca solo advierte. */
  if(metodo==='Manual'||metodo==='Por grupo'){
    const ctsVal = metodo==='Manual'
      ? chks.map(id=>DB.cuentas.find(x=>x.id===id)).filter(Boolean)
      : DB.cuentas.filter(c=>c.grupo===grupo);
    const bl=bloqueosDeAsignacion(dest, ctsVal);
    if(bl.regFuera.length){
      toast(`${dest} no tiene autorizada la región ${bl.regFuera.join(', ')}. Ajusta su alcance en Usuarios o elige otro ejecutivo.`,'bad');
      return;
    }
    if(bl.marFuera.length){
      toast(`Atención: ${dest} no tiene autorizada la marca ${bl.marFuera.join(', ')}. Revisa su alcance en Usuarios.`,'bad');
      return;
    }
  }
  if(metodo==='Manual'){ if(!chks.length){toast('Selecciona al menos una cuenta.','bad');return;}
    chks.forEach(id=>{const c=DB.cuentas.find(x=>x.id===id); if(c){c.ejecutivo=dest;n++;}}); }
  else if(metodo==='Por grupo'){ DB.cuentas.filter(c=>c.grupo===grupo).forEach(c=>{c.ejecutivo=dest;n++;}); }
  else { n=DB.ejecutivos.reduce((s,e)=>s+(e.recuperado/e.meta<.5?6:e.recuperado/e.meta<.75?3:1),0); }
  /* e.cuentas ya no se incrementa: el conteo se deriva en vivo de DB.cuentas (A-03). */
  log('Asignación de cartera',`${metodo} · ${n} cuenta(s) → ${dest}`,mot,null,`${n} cuentas`);
  closeModal(); toast(`Asignación ${metodo.toLowerCase()} aplicada: ${n} cuenta(s). Registrada en bitácora.`,'ok');
  go('asignacion');
}

if(typeof falcoTab==='undefined') window.falcoTab='sinAsignar';
if(typeof falcoBusq==='undefined') window.falcoBusq='';
VIEWS.falcoAsig=()=>{
  const tab=window.falcoTab||'sinAsignar';
  const busq=(window.falcoBusq||'').toLowerCase().trim();
  const sinAsignar=DB.falcos.filter(f=>!f.ejec||f.estatus==='RECIBIDO');
  const enGestion=DB.falcos.filter(f=>f.ejec&&f.estatus!=='RECIBIDO');
  const filtrar=arr=>busq?arr.filter(f=>
    f.id.toLowerCase().includes(busq)||
    f.lider.toLowerCase().includes(busq)||
    f.grupo.toLowerCase().includes(busq)||
    f.motivo.toLowerCase().includes(busq)||
    (f.ejec||'').toLowerCase().includes(busq)
  ):arr;
  const lista=filtrar(tab==='sinAsignar'?sinAsignar:enGestion);

  const falcoRow=f=>[
    `<b>${f.id}</b>`,esc(f.lider),`${esc(f.grupo)} · ${f.ruta}`,esc(f.motivo),
    f.nCli,fmt(f.adeudo),
    `<span class="pill ${f.categoriaLider==='Riesgo alto'?'a':f.categoriaLider==='En observación'?'m':'g'}">${f.categoriaLider||'—'}</span>`,
    `<span class="pill ${f.estatus==='ESCALADO'?'a':f.estatus==='RECUPERADO'?'g':f.estatus==='EN_GESTION'?'m':'n'}">${labelEstatusFalco(f.estatus)}</span>`,
    f.ejec?esc(f.ejec):'<span class="pill n">Sin asignar</span>',
    (()=>{
      if(f.estatus==='RECUPERADO') return '<span class="pill g" style="font-size:10.5px">✓ Caso cerrado</span>';
      const btns=[`<button class="act sm ${f.ejec?'o':''}" onclick="asignarFalco('${f.id}')">${f.ejec?'Reasignar':'Asignar'}</button>`];
      if(f.ejec&&f.estatus==='EN_GESTION'){
        btns.push(`<button class="act sm o" onclick="escalarFalco('${f.id}')">↑ Escalar</button>`);
      }
      if(f.ejec&&(f.estatus==='EN_GESTION'||f.estatus==='ESCALADO')){
        btns.push(`<button class="act sm i" onclick="resolverFalco('${f.id}')">✓ Resolver</button>`);
      }
      return `<div class="btnrow">${btns.join('')}</div>`;
    })()
  ];

  return head('Asignación de FALCO','Jefatura · faltantes de líder de grupo',
    'Los FALCO llegan aquí cuando el área Comercial los reporta. Asigna cada uno a un ejecutivo con una instrucción de gestión clara.')
  + kpi([
      {n:DB.falcos.length,l:'FALCO activos en la catorcena'},
      {n:fmt(DB.falcos.reduce((s,f)=>s+f.adeudo,0)),l:'Monto involucrado'},
      {n:sinAsignar.length,l:'Sin asignar',cls:sinAsignar.length?'down':'up',d:sinAsignar.length?'Requieren asignación':''},
      {n:DB.falcos.filter(f=>f.estatus==='RECUPERADO').length,l:'Resueltos',cls:'up'}
    ])
  /* ── Buscador ── */
  + `<div class="filters" style="margin-bottom:14px">
      <input id="falcoBusqI" type="search" placeholder="Buscar por ID, líder, grupo, motivo o ejecutivo…"
        value="${esc(window.falcoBusq||'')}"
        oninput="window.falcoBusq=this.value;go('falcoAsig')">
      <button class="act o sm" ${busq?'':'style="opacity:.4;cursor:default"'}
        onclick="${busq?`window.falcoBusq='';go('falcoAsig')`:''}">✕ Limpiar</button>
    </div>`
  /* ── Pestañas ── */
  + `<div role="tablist" aria-label="Filtro de FALCO" style="display:flex;gap:0;border-bottom:2px solid var(--line);margin-bottom:16px">
      <button role="tab" aria-selected="${tab==='sinAsignar'}" onclick="window.falcoTab='sinAsignar';go('falcoAsig')"
        style="padding:9px 20px;font-size:12.5px;font-weight:700;border:none;cursor:pointer;background:none;
               border-bottom:${tab==='sinAsignar'?'2.5px solid var(--turq)':'2.5px solid transparent'};
               color:${tab==='sinAsignar'?'var(--turq)':'var(--text3)'};margin-bottom:-2px">
        📥 Sin asignar
        ${sinAsignar.length?`<span class="pill a" style="margin-left:6px">${sinAsignar.length}</span>`:''}
      </button>
      <button role="tab" aria-selected="${tab==='enGestion'}" onclick="window.falcoTab='enGestion';go('falcoAsig')"
        style="padding:9px 20px;font-size:12.5px;font-weight:700;border:none;cursor:pointer;background:none;
               border-bottom:${tab==='enGestion'?'2.5px solid var(--turq)':'2.5px solid transparent'};
               color:${tab==='enGestion'?'var(--turq)':'var(--text3)'};margin-bottom:-2px">
        🔄 En gestión / Historial
        <span class="pill n" style="margin-left:6px">${enGestion.length}</span>
      </button>
    </div>`
  + `<div class="panel">
      ${lista.length
        ? tabla(['FALCO','Líder','Grupo / Ruta','Motivo','Clientes','Monto','Categoría','Estatus','Ejecutivo','Acción'],
            lista.map(falcoRow),1080)
        : `<div class="empty">${busq?'Sin resultados para "'+esc(busq)+'"':tab==='sinAsignar'?'Todos los FALCO están asignados. ✓':'Sin FALCO en gestión.'}</div>`}
      <div class="note" style="margin-top:12px">Da clic en el botón de acción para ver el detalle del líder (domicilio, ubicación, categoría) antes de asignar.</div>
    </div>`;
};

function asignarFalco(fid){
  const f=DB.falcos.find(x=>x.id===fid);
  modal(`<h3>${f.ejec?'Reasignar':'Asignar'} FALCO ${f.id}</h3>
    <div class="msub">${esc(f.grupo)} · ${esc(f.region)}</div>
    <dl class="dl">
      <dt>Líder</dt><dd><b>${esc(f.lider)}</b></dd>
      <dt>Categoría</dt><dd><span class="pill ${f.categoriaLider==='Riesgo alto'?'a':f.categoriaLider==='En observación'?'m':'g'}">${f.categoriaLider||'—'}</span></dd>
      <dt>Domicilio</dt><dd>${esc(f.domicilioLider||'No capturado')}</dd>
      <dt>Geolocalización</dt><dd>${f.lat?`<a href="https://www.google.com/maps?q=${f.lat},${f.lon}" target="_blank" rel="noopener">${f.lat}, ${f.lon}</a>`:'No capturada'}</dd>
      <dt>Teléfono ruta</dt><dd>${esc(f.tel)}</dd>
      <dt>Total de clientes</dt><dd><b>${f.nCli}</b> clientes en el grupo</dd>
      <dt>Motivo del FALCO</dt><dd>${esc(f.motivo)}</dd>
      <dt>Monto involucrado</dt><dd><b>${fmt(f.adeudo)}</b></dd>
      <dt>Reportado por</dt><dd>${esc(f.repPor)} · ${f.fecha}</dd>
    </dl>
    <div class="field" style="margin-top:14px"><label for="fEjec">Ejecutivo responsable</label>
      ${(()=>{const aut=DB.ejecutivos.filter(e=>puedeAtenderRegion(e.n,f.region));
        return aut.length
          ? `<select id="fEjec">${aut.map(e=>`<option ${e.n===f.ejec?'selected':''}>${esc(e.n)}</option>`).join('')}</select>
             <div class="hint">Solo se listan ejecutivos autorizados en la región ${esc(f.region)}.</div>`
          : `<select id="fEjec" disabled><option value="">Sin ejecutivos autorizados en ${esc(f.region)}</option></select>
             <div class="note bad" style="margin-top:6px">Ningún ejecutivo tiene autorizada la región ${esc(f.region)}. Ajusta el alcance en Usuarios antes de asignar.</div>`;})()}</div>
    <div class="field"><label for="fMot">Instrucción de gestión</label><textarea id="fMot" placeholder="Ej. Verificar recibos del corte y contrastar con depósito en banco."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="guardarFalco('${fid}')">Asignar ejecutivo</button></div>`);
}
function guardarFalco(fid){
  const f=DB.falcos.find(x=>x.id===fid);
  const ej=(document.getElementById('fEjec')||{}).value, mot=(document.getElementById('fMot')||{}).value||'';
  if(!mot.trim()){toast('Captura la instrucción de gestión.','bad');return;}
  if(!ej){toast('Selecciona el ejecutivo que atenderá el FALCO.','bad');return;}
  /* A-09: el FALCO debe asignarse a un ejecutivo autorizado en la región del faltante. */
  if(!puedeAtenderRegion(ej,f.region)){
    toast(`${ej} no tiene autorizada la región ${f.region}. Elige un ejecutivo de esa región o ajusta su alcance en Usuarios.`,'bad');
    return;
  }
  const antes=f.ejec||'sin asignar';
  const esReasignacion=!!f.ejec;
  f.ejec=ej;
  if(f.estatus==='RECIBIDO')f.estatus='EN_GESTION';
  /* El reloj de riesgo arranca en la PRIMERA asignación y no se reinicia al reasignar,
     para que reasignar no sirva para poner el semáforo en cero. */
  if(!f.fechaAsignacion) f.fechaAsignacion=fecha(HOY);
  const _sem=semanasDesdeAsignacion(f);
  log(esReasignacion?'Reasignación de FALCO':'Asignación de FALCO',
      `${f.id} · ${f.lider}`+(esReasignacion
        ? ` · el reloj de riesgo NO se reinicia (asignado originalmente el ${f.fechaAsignacion}, ${_sem} semana${_sem===1?'':'s'})`
        : ` · asignado el ${f.fechaAsignacion}`),
      mot,antes,ej);
  closeModal();
  toast(esReasignacion
    ? `FALCO ${f.id} reasignado a ${ej}. El reloj de riesgo sigue corriendo desde el ${f.fechaAsignacion}.`
    : `FALCO ${f.id} asignado a ${ej}. El reloj de riesgo inicia hoy.`,'ok');
  go('falcoAsig');
}

/* ── Ciclo de vida completo de FALCO: escalar y resolver ── */
function escalarFalco(fid){
  const f=DB.falcos.find(x=>x.id===fid);
  modal(`<h3>↑ Escalar FALCO ${f.id}</h3>
    <div class="msub">${esc(f.lider)} · ${esc(f.grupo)}</div>
    <div class="note warn">Escalar notifica a Gerencia y da prioridad al caso. Úsalo cuando se cumplieron ${P('SEMANAS_DESDE_ASIGNACION')} semanas desde la asignación sin recuperación, o si el riesgo se agravó. Al escalar, el reloj de riesgo se detiene.</div>
    <div class="field"><label for="fEscMot">Motivo del escalamiento</label>
      <textarea id="fEscMot" placeholder="Ej. Sin avance tras ${P('SEMANAS_DESDE_ASIGNACION')} semanas desde la asignación. Se sospecha que el líder cambió de domicilio."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act r" onclick="confirmarEscalarFalco('${fid}')">Confirmar escalamiento</button></div>`);
}
function confirmarEscalarFalco(fid){
  const mot=(document.getElementById('fEscMot')||{}).value||'';
  if(!mot.trim()){toast('El motivo del escalamiento es obligatorio.','bad');return;}
  const f=DB.falcos.find(x=>x.id===fid);
  const antes=f.estatus; f.estatus='ESCALADO';
  log('Escalamiento de FALCO',`${f.id} · ${f.lider} · ${esc(f.grupo)}`,mot,antes,'ESCALADO');
  closeModal(); toast(`FALCO ${f.id} escalado a Gerencia.`,'bad'); go('falcoAsig');
}
function resolverFalco(fid){
  const f=DB.falcos.find(x=>x.id===fid);
  modal(`<h3>✓ Resolver FALCO ${f.id}</h3>
    <div class="msub">${esc(f.lider)} · ${esc(f.grupo)} · ${fmt(f.adeudo)}</div>
    <div class="field"><label for="fResResultado">Resultado</label>
      <select id="fResResultado">
        <option value="Recuperado">Monto recuperado en su totalidad</option>
        <option value="Recuperado parcial">Recuperado parcialmente / condonado el resto</option>
        <option value="Sin responsabilidad">Se descartó responsabilidad del líder</option>
      </select>
    </div>
    <div class="field"><label for="fResMot">Detalle de cierre</label>
      <textarea id="fResMot" placeholder="Ej. El líder cubrió el monto completo el 30-ago-2026 en efectivo, recibo F-8821."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act i" onclick="confirmarResolverFalco('${fid}')">Confirmar cierre</button></div>`);
}
function confirmarResolverFalco(fid){
  const resultado=(document.getElementById('fResResultado')||{}).value||'';
  const mot=(document.getElementById('fResMot')||{}).value||'';
  if(!mot.trim()){toast('Describe el detalle de cierre.','bad');return;}
  const f=DB.falcos.find(x=>x.id===fid);
  const antes=f.estatus; f.estatus='RECUPERADO'; f.resultadoCierre=resultado; f.fechaCierre=fecha(HOY);
  log('Resolución de FALCO',`${f.id} · ${f.lider} · ${resultado}`,mot,antes,'RECUPERADO');
  closeModal(); toast(`FALCO ${f.id} cerrado como ${resultado.toLowerCase()}.`,'ok'); go('falcoAsig');
}

/* ══════════════════════════════════════════════════════════════════
   10. VISTAS · GERENCIA
   ══════════════════════════════════════════════════════════════════ */
/* Deriva SIEMPRE del equipo real (regla de negocio: meta de jefatura = suma de su
   plantilla con cartera). Los campos j.recuperado/j.meta del dato semilla se ignoran. */
const jefaturasCalc=()=>DB.jefaturas.map(j=>{const a=agregadoJefatura(j.n);
    return {...j, meta:a.meta, recuperado:a.recuperado, logro:a.logro, tend:j.prev[5]-j.prev[4]};})
  .sort((a,b)=>b.logro-a.logro);

/* ══ CARTERA DE JEFATURAS — Gerencia ══ */
/* ── Multi-check filter helpers ── */
// fltState: { fMarca: Set, fRuta: Set, fReg: Set, fEst: Set }
window.fltState = window.fltState || {fMarca:new Set(),fRuta:new Set(),fReg:new Set(),fEst:new Set()};
window.fltOpen  = window.fltOpen  || '';

function toggleFltMenu(key){
  if(window.fltOpen===key){ closeFltMenu(); return; }
  closeFltMenu();
  window.fltOpen=key;
  const btn=document.getElementById('fltBtn_'+key);
  if(btn) btn.classList.add('open');
  const menuOrig=document.getElementById('fltMenu_'+key);
  if(menuOrig&&btn){
    const br=btn.getBoundingClientRect();
    // Clonar el menú al body para evitar clipping del contenedor
    const menuId='fltMenuFloat_'+key;
    let m=document.getElementById(menuId);
    if(m) m.remove();
    m=menuOrig.cloneNode(true);
    m.id=menuId;
    m.style.position='fixed';
    m.style.top=(br.bottom+5)+'px';
    m.style.left=br.left+'px';
    m.style.right='auto';
    m.style.zIndex='9999';
    m.style.display='block';
    m.style.visibility='hidden';
    // Sincronizar eventos: los checkboxes del clon deben disparar toggleFltOpt
    m.querySelectorAll('input[type=checkbox]').forEach(cb=>{
      cb.addEventListener('change',function(){
        // Reflejar el estado en el original
        const origCb=menuOrig.querySelector(`input[value="${CSS.escape(cb.value)}"]`);
        if(origCb) origCb.checked=cb.checked;
        cb.checked?window.fltState[key].add(cb.value):window.fltState[key].delete(cb.value);
        // Actualizar badge
        const b2=btn.querySelector('.badge');
        const sz=window.fltState[key].size;
        if(sz>0){if(b2)b2.textContent=sz;else{const nb=document.createElement('span');nb.className='badge';nb.textContent=sz;btn.appendChild(nb);}}
        else if(b2)b2.remove();
        renderTablaCartera();
      });
    });
    // Botón Limpiar del clon
    const limpBtn=m.querySelector('.flt-actions button');
    if(limpBtn) limpBtn.onclick=()=>{
      window.fltState[key].clear();
      menuOrig.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);
      m.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);
      const b2=btn.querySelector('.badge');if(b2)b2.remove();
      renderTablaCartera();
    };
    document.body.appendChild(m);
    window.fltFloat=m;
    // Posicionar correctamente tras medir
    requestAnimationFrame(()=>{
      const mw=m.offsetWidth;
      if(br.left+mw>window.innerWidth-8){
        m.style.left=Math.max(8,window.innerWidth-mw-8)+'px';
      }
      m.style.visibility='visible';
    });
  }
  let bk=document.getElementById('fltBack_'+key);
  if(!bk){ bk=document.createElement('div'); bk.id='fltBack_'+key;
    bk.className='fltBack'; bk.onclick=closeFltMenu; document.body.appendChild(bk); }
  bk.style.display='block';
}
function closeFltMenu(){
  if(!window.fltOpen) return;
  const btn=document.getElementById('fltBtn_'+window.fltOpen);
  if(btn) btn.classList.remove('open');
  const bk=document.getElementById('fltBack_'+window.fltOpen);
  if(bk) bk.style.display='none';
  // Eliminar el clon flotante
  const floatMenu=document.getElementById('fltMenuFloat_'+window.fltOpen);
  if(floatMenu) floatMenu.remove();
  if(window.fltFloat) window.fltFloat.remove();
  window.fltFloat=null;
  window.fltOpen='';
}
function toggleFltOpt(key,val){
  const st=window.fltState[key];
  st.has(val)?st.delete(val):st.add(val);
  renderTablaCartera();
  // Actualizar badge en el botón
  const btn=document.getElementById('fltBtn_'+key);
  if(btn){
    const badge=btn.querySelector('.badge');
    if(badge){ if(st.size>0) badge.textContent=st.size; else badge.remove(); }
    else if(st.size>0){
      const b=document.createElement('span');
      b.className='badge';b.textContent=st.size;btn.appendChild(b);
    }
  }
}
function clearFltAll(){
  Object.values(window.fltState).forEach(s=>s.clear());
  ['fMarca','fRuta','fReg','fEst'].forEach(k=>{
    document.querySelectorAll(`#fltMenu_${k} input[type=checkbox]`).forEach(c=>c.checked=false);
    const btn=document.getElementById('fltBtn_'+k);
    if(btn){const b=btn.querySelector('.badge');if(b)b.remove();}
  });
  const fq=document.getElementById('fq'); if(fq) fq.value='';
  renderTablaCartera();
  closeFltMenu();
}

// Construir menú de opciones
function buildFltMenu(key,opts,label){
  const st=window.fltState[key]||new Set();
  return `<div class="fltDrop" id="fltDrop_${key}">
    <button id="fltBtn_${key}" class="fltBtn" onclick="toggleFltMenu('${key}')">
      ${label} ▾${st.size?`<span class="badge">${st.size}</span>`:''}
    </button>
    <div id="fltMenu_${key}" class="fltMenu" style="display:${window.fltOpen===key?'block':'none'}">
      ${opts.map(o=>`<label><input type="checkbox" ${st.has(o)?'checked':''}
        onchange="toggleFltOpt('${key}','${o.replace(/'/g,"\'")}')">${esc(o)}</label>`).join('')}
      <div class="flt-sep"></div>
      <div class="flt-actions">
        <button class="act o sm" onclick="window.fltState['${key}'].clear();
          document.querySelectorAll('#fltMenu_${key} input').forEach(c=>c.checked=false);
          const b=document.getElementById('fltBtn_${key}').querySelector('.badge');if(b)b.remove();
          renderTablaCartera()">Limpiar</button>
      </div>
    </div>
  </div>`;
}
// Asegurar que los menús estén visibles cuando fltOpen coincide

function toggleEj(n){
  if(typeof window.ejAbiertos==='undefined') window.ejAbiertos=new Set();
  window.ejAbiertos.has(n)?window.ejAbiertos.delete(n):window.ejAbiertos.add(n);
  go('carteraEquipo');
}
/* E2E-1: el botón "Expandir todo" de Cartera del Equipo llamaba a expandirEjs(),
   que nunca existió. Se intentó apuntarlo a expandirTodos(), pero esa función
   opera sobre gruposAbiertos (los grupos de Mi Cartera), no sobre ejAbiertos
   (los ejecutivos de esta pantalla): habría seguido sin expandir nada.
   Esta es la función que faltaba, análoga a toggleEj pero para todo el equipo. */
function expandirTodosEj(v){
  window.ejAbiertos = v ? new Set(equipo().map(e=>e.n)) : new Set();
  go('carteraEquipo');
}
let jefAbiertos=new Set();
function toggleJef(n){ jefAbiertos.has(n)?jefAbiertos.delete(n):jefAbiertos.add(n); go('carterasGer'); }

if(typeof window.cgFiltroJef==='undefined') window.cgFiltroJef='';
if(typeof window.cgFiltroEj==='undefined')  window.cgFiltroEj='';
if(typeof window.cgFiltroGrupo==='undefined') window.cgFiltroGrupo='';
if(typeof window.cgFiltroQ==='undefined')   window.cgFiltroQ='';
VIEWS.carterasGer=()=>{
  /* A-01: alcance = jefaturas cuyo jefe directo es la gerencia en sesión y que
     tienen al menos un ejecutivo con cartera. */
  const _ger=ROLES[currentRole]?.persona;
  const _enAlcance=new Set(jefaturasDeGerencia(_ger).map(j=>j.n));
  const js=jefaturasCalc().filter(j=>_enAlcance.has(j.n));
  const fJef=window.cgFiltroJef||'', fEj=window.cgFiltroEj||'';
  const fGr=window.cgFiltroGrupo||'', fQ=window.cgFiltroQ||'';
  const jsFilt=fJef?js.filter(j=>j.n===fJef):js;
  // Opciones de filtro
  const ejOpts=[...new Set(DB.ejecutivos.map(e=>e.n))].sort();
  const grupoOpts=[...new Set(DB.cuentas.map(c=>c.grupo))].filter(Boolean).sort();
  const filtCuenta=c=>(
    (!fEj||c.ejecutivo===fEj)&&
    (!fGr||c.grupo===fGr)&&
    (!fQ||(c.cliente+' '+c.id+' '+c.grupo).toLowerCase().includes(fQ.toLowerCase()))
  );
  /* E2E-3: el encabezado se deriva del MISMO conjunto que se lista abajo — las
     jefaturas ya filtradas, su plantilla real y las cuentas que pasan filtCuenta.
     Antes usaba DB.cuentas.filter(c=>c.jefatura), que ignoraba los filtros y contaba
     cuentas de jefaturas fuera del alcance de la gerencia. */
  const _ctasVisiblesGer=jsFilt.flatMap(j=>
    plantillaDeJefatura(j.n,true).flatMap(e=>
      DB.cuentas.filter(c=>c.ejecutivo===e.n&&filtCuenta(c))));
  const total=_ctasVisiblesGer.length;
  const totalS=_ctasVisiblesGer.reduce((s,c)=>s+c.saldoReal,0);
  return head('Cartera de Jefaturas','Gerencia · Jefatura → Ejecutivos → Cuentas',
    'Navega por jefatura para ver el detalle de sus ejecutivos y sus carteras.')
  + `<div class="gerFilters">
      <label for="fJefatura1">Jefatura</label>
      <select id="fJefatura1" onchange="window.cgFiltroJef=this.value;go('carterasGer')">
        <option value="">Todas las jefaturas</option>
        ${js.map(j=>`<option value="${esc(j.n)}" ${fJef===j.n?'selected':''}>${esc(j.n)}</option>`).join('')}
      </select>
      <label for="fEjecutivo1">Ejecutivo</label>
      <select id="fEjecutivo1" onchange="window.cgFiltroEj=this.value;go('carterasGer')">
        <option value="">Todos los ejecutivos</option>
        ${ejOpts.map(e=>`<option value="${esc(e)}" ${fEj===e?'selected':''}>${esc(e)}</option>`).join('')}
      </select>
      <label for="fGrupo1">Grupo</label>
      <select id="fGrupo1" onchange="window.cgFiltroGrupo=this.value;go('carterasGer')">
        <option value="">Todos los grupos</option>
        ${grupoOpts.map(g=>`<option value="${esc(g)}" ${fGr===g?'selected':''}>${esc(g)}</option>`).join('')}
      </select>
      <input type="search" placeholder="Buscar cliente, ID o cuenta…"
        style="padding:6px 10px;border:1.5px solid var(--line);border-radius:8px;font-size:12px;min-width:180px"
        value="${esc(fQ)}"
        oninput="window.cgFiltroQ=this.value;go('carterasGer')">
      <button class="clr-btn" ${(fJef||fEj||fGr||fQ)?'':'style="opacity:.4;cursor:default"'}
        onclick="${(fJef||fEj||fGr||fQ)?`window.cgFiltroJef=window.cgFiltroEj=window.cgFiltroGrupo=window.cgFiltroQ='';go('carterasGer')`:''}">
        ✕ Limpiar filtros
      </button>
    </div>`
  + `<div class="panel">
      <h3>Jefaturas <span class="pill n">${jsFilt.length} · ${total} cuentas · ${fmt(totalS)}</span></h3>
      ${jsFilt.map(j=>{
        const ab=jefAbiertos.has(j.n)||(fJef===j.n);
        const col=colorLogro(j.logro);
        const cs=DB.cuentas.filter(c=>c.jefatura===j.n&&filtCuenta(c));
        return `<div class="grpBlock ${ab?'on':''}">
          <button class="grpHead" aria-expanded="${ab}" onclick="toggleJef('${j.n.replace(/'/g,"\'")}')">
            <span class="gchev">▸</span>
            <div style="width:36px;height:36px;border-radius:9px;background:${colorLogroBg(j.logro)};
                 display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${col};flex-shrink:0">${(j.logro*100).toFixed(0)}%</div>
            <div class="gmain">
              <b>${esc(j.n)}</b>
              <span>${esc(j.region)} · ${cs.length} cuentas · ${fmt(cs.reduce((s,c)=>s+c.saldoReal,0))} en gestión</span>
              <div class="miniProg" style="margin-top:4px"><i style="width:${Math.min(100,j.logro*100)}%;background:${col}"></i></div>
            </div>
            <div class="gstat"><b>${fmt(j.recuperado)}</b><span>recuperado</span></div>
            <div class="gstat"><b>${fmt(j.meta)}</b><span>meta</span></div>
          </button>
          ${ab?`<div class="grpBody">
            ${(()=>{
              if(typeof window.cgerEjAb==='undefined') window.cgerEjAb=new Set();
              return DB.ejecutivos.filter(e=>!fEj||e.n===fEj).map(e=>{
                const ec=cs.filter(c=>c.ejecutivo===e.n);
                if(!ec.length) return '';
                const logE=e.meta?e.recuperado/e.meta:0;
                const colE=colorLogro(logE);
                const groups={};ec.forEach(c=>{(groups[c.grupo]??=[]).push(c);});
                const ejAb=window.cgerEjAb.has(e.n);
                const ejKey=e.n.replace(/[^a-zA-Z0-9]/g,'_');
                return `<div class="grpBlock ${ejAb?'on':''}" style="margin-bottom:10px">
                  <button class="grpHead" aria-expanded="${ejAb}" onclick="window.cgerEjAb=window.cgerEjAb||new Set();
                    window.cgerEjAb.has('${esc(e.n)}')?window.cgerEjAb.delete('${esc(e.n)}'):window.cgerEjAb.add('${esc(e.n)}');go('carterasGer')">
                    <span class="gchev">${ejAb?'▾':'▸'}</span>
                    <div style="width:30px;height:30px;border-radius:7px;
                         background:${colorLogroBg(logE)};
                         display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:${colE}">
                      ${(logE*100).toFixed(0)}%
                    </div>
                    <div class="gmain">
                      <b>${esc(e.n)}</b>
                      <span>${ec.length} cuentas · ${Object.keys(groups).length} grupos · ${fmt(ec.reduce((s,c)=>s+c.saldoReal,0))}</span>
                      <div class="miniProg" style="margin-top:4px"><i style="width:${Math.min(100,logE*100)}%;background:${colE}"></i></div>
                    </div>
                    <div class="gstat"><b>${fmt(e.recuperado)}</b><span>recuperado</span></div>
                    <div class="gstat"><b>${fmt(e.meta)}</b><span>meta</span></div>
                  </button>
                  ${ejAb?`<div class="grpBody">
                    <!-- Grupos expandibles dentro de ejecutivo en carterasGer -->
                    ${(()=>{
                      if(typeof window.grpAbGer==='undefined') window.grpAbGer={};
                      const _ejKey=e.n;
                      const ESC_D=P('DIAS_MORA_ESCALACION');
                      const gruposList=Object.entries(groups);
                      return `<div style="font-size:11px;color:var(--text3);margin:0 0 10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                        <span>${gruposList.length} grupo${gruposList.length!==1?'s':''} · ${ec.length} cuentas</span>
                        <button class="act o sm" style="font-size:10px;padding:3px 8px"
                          data-ejkey="${_ejKey}" data-goms='${JSON.stringify(Object.keys(groups))}'
                          onclick="(function(b){window.grpAbGer=window.grpAbGer||{};window.grpAbGer[b.dataset.ejkey]=JSON.parse(b.dataset.goms);go('carterasGer');})(this)">▾ Expandir grupos</button>
                        <button class="act o sm" style="font-size:10px;padding:3px 8px"
                          data-ejkey="${_ejKey}"
                          onclick="(function(b){window.grpAbGer=window.grpAbGer||{};window.grpAbGer[b.dataset.ejkey]=[];go('carterasGer');})(this)">▸ Colapsar</button>
                      </div>
                      ${gruposList.map(([gnom,cts])=>{
                        const _gOpen=((window.grpAbGer||{})[_ejKey]||[]).includes(gnom);
                        const _sdoG=cts.reduce((s,c)=>s+c.saldoReal,0);
                        const _maxD=Math.max(...cts.map(c=>c.diasVenc));
                        return `<div class="grpBlock ${_gOpen?'on':''}" style="margin-bottom:6px">
                          <button class="grpHead" style="padding:10px 12px" aria-expanded="${_gOpen}"
                            data-ejkey="${_ejKey}" data-gnom="${gnom.replace(/"/g,'&quot;')}"
                            onclick="(function(b){
                              var ek=b.dataset.ejkey, gn=b.dataset.gnom;
                              window.grpAbGer=window.grpAbGer||{};
                              var arr=[...((window.grpAbGer[ek])||[])];
                              var ii=arr.indexOf(gn);
                              ii>-1?arr.splice(ii,1):arr.push(gn);
                              window.grpAbGer[ek]=arr;
                              go('carterasGer');
                            })(this)">
                            <span class="gchev">${_gOpen?'▾':'▸'}</span>
                            <span style="font-size:14px;flex-shrink:0">📍</span>
                            <div class="gmain">
                              <b>${esc(gnom)}</b>
                              <span>${cts.length} cliente${cts.length!==1?'s':''} · ${fmt(_sdoG)}</span>
                            </div>
                            <div class="gstat"><b>${_maxD}</b><span>días max</span></div>
                            <span class="pill ${_maxD>=ESC_D?'a':'g'}" style="font-size:10px">
                              ${_maxD>=ESC_D?'⚠ Mora alta':'Sin mora alta'}
                            </span>
                          </button>
                          ${_gOpen?`<div class="grpBody">
                            ${tabla(['Cuenta','Cliente','Marca','Saldo','Días','Estatus',''],
                              cts.slice().sort((a,b)=>b.diasVenc-a.diasVenc).map(c=>[
                                '<b>'+c.id+'</b>',esc(c.cliente),esc(c.marca),fmt(c.saldoReal),
                                '<span class="num">'+c.diasVenc+'</span>',
                                pillEstatus(c.estatus),
                                '<button class="act sm o" onclick="go(\'detalle\',\''+c.id+'\')">' + 'Ver detalle</button>',
                              ]),820)}
                          </div>`:''}
                        </div>`;}).join('')}`;
                    })()}
                  </div>`:''}
                </div>`;}).join('');
            })()}
          </div>`:''}
        </div>`;}).join('')}
    </div>`;
};

/* ══ DICTAMINACIONES DE GERENCIA — VoBo final ══ */
if(typeof window.dictGerTab==='undefined') window.dictGerTab='pendientes';
if(typeof window.dictGerBusq==='undefined') window.dictGerBusq='';
VIEWS.dictGer=()=>{
  const ESTADO_LABEL={
    'PENDIENTE_VOBO':'En Jefatura',
    'VOBO_JEFATURA':'Pendiente de tu aprobación final',
    'RECHAZADA_JEFATURA':'Rechazada por Jefatura',
    'VOBO_GERENCIA':'Aprobada por Gerencia',
    'RECHAZADA_GERENCIA':'Rechazada por Gerencia'
  };
  const ESTADO_PILL={'PENDIENTE_VOBO':'n','VOBO_JEFATURA':'m','RECHAZADA_JEFATURA':'a','VOBO_GERENCIA':'g','RECHAZADA_GERENCIA':'a'};
  const todas=DB.dictaminaciones;
  const tab=window.dictGerTab||'pendientes';
  const busq=(window.dictGerBusq||'').toLowerCase().trim();
  const pendGer=todas.filter(d=>d.estado==='VOBO_JEFATURA');
  const historial=todas.filter(d=>d.estado!=='VOBO_JEFATURA');
  const filtrar=arr=>busq?arr.filter(d=>
    d.cliente.toLowerCase().includes(busq)||
    d.cuentaId.toLowerCase().includes(busq)||
    d.ejecutivo.toLowerCase().includes(busq)||
    d.resolucion.toLowerCase().includes(busq)
  ):arr;

  return head('Dictaminaciones','Gerencia · aprobación final',
    'Las dictaminaciones con VoBo de Jefatura llegan aquí para tu aprobación final. Solo tú puedes cerrar el proceso.')
  + kpi([
      {n:pendGer.length,l:'Pendientes de tu VoBo',cls:pendGer.length?'down':'up',d:pendGer.length?'Requieren tu aprobación final':'Sin pendientes'},
      {n:todas.filter(d=>d.estado==='VOBO_GERENCIA').length,l:'Aprobadas',cls:'up'},
      {n:todas.filter(d=>d.estado==='RECHAZADA_GERENCIA').length,l:'Rechazadas por ti'},
      {n:todas.filter(d=>d.estado==='PENDIENTE_VOBO').length,l:'En Jefatura'}
    ])
  + (pendGer.length&&tab==='pendientes'?`<div class="note warn" style="margin-bottom:16px">
      <b>Tienes ${pendGer.length} dictaminación${pendGer.length>1?'es':''} esperando tu aprobación final.</b>
      Solo tu firma cierra el proceso y mueve la cuenta a quebranto.
    </div>`:'')
  /* Buscador */
  + `<div class="filters" style="margin-bottom:14px">
      <input id="dictBusqGer" type="search" placeholder="Buscar por cliente, cuenta, ejecutivo o categoría…"
        value="${esc(window.dictGerBusq||'')}"
        oninput="window.dictGerBusq=this.value;go('dictGer')">
      <button class="act o sm" ${busq?'':'style="opacity:.4;cursor:default"'}
        onclick="${busq?`window.dictGerBusq='';go('dictGer')`:''}">✕ Limpiar</button>
    </div>`
  /* Pestañas */
  + `<div role="tablist" aria-label="Filtro de dictaminaciones" style="display:flex;gap:0;border-bottom:2px solid var(--line);margin-bottom:18px">
      <button role="tab" aria-selected="${tab==='pendientes'}" onclick="window.dictGerTab='pendientes';go('dictGer')"
        style="padding:9px 20px;font-size:12.5px;font-weight:700;border:none;cursor:pointer;
               background:none;border-bottom:${tab==='pendientes'?'2.5px solid var(--turq)':'2.5px solid transparent'};
               color:${tab==='pendientes'?'var(--turq)':'var(--text3)'};margin-bottom:-2px">
        ⏳ Pendientes de aprobación
        ${pendGer.length?`<span class="pill a" style="margin-left:6px">${pendGer.length}</span>`:''}
      </button>
      <button role="tab" aria-selected="${tab==='historial'}" onclick="window.dictGerTab='historial';go('dictGer')"
        style="padding:9px 20px;font-size:12.5px;font-weight:700;border:none;cursor:pointer;
               background:none;border-bottom:${tab==='historial'?'2.5px solid var(--turq)':'2.5px solid transparent'};
               color:${tab==='historial'?'var(--turq)':'var(--text3)'};margin-bottom:-2px">
        📋 Historial
        <span class="pill n" style="margin-left:6px">${historial.length}</span>
      </button>
    </div>`
  + (tab==='pendientes'
    ? (filtrar(pendGer).length
        ? filtrar(pendGer).map(d=>dictCard(d,ESTADO_LABEL,ESTADO_PILL,true,'gerencia')).join('')
        : `<div class="empty">${busq?'Sin resultados para "'+esc(busq)+'"':'Sin dictaminaciones pendientes de aprobación.'}</div>`)
    : (filtrar(historial).length
        ? filtrar(historial).map(d=>dictCard(d,ESTADO_LABEL,ESTADO_PILL,false,'gerencia')).join('')
        : `<div class="empty">${busq?'Sin resultados para "'+esc(busq)+'"':'Sin historial de dictaminaciones.'}</div>`));
};


/* ═══════════════════════════════════════════════════════════════════════
   TABLERO COMPARTIDO: Gerencia + Director de Unidad de Negocio
   Función única reutilizada por ambos roles.
   ═══════════════════════════════════════════════════════════════════════ */
function renderTabGerDir(rolLabel){
  const _gerPersona = ROLES[currentRole]?.persona;
  const _alcanceJef = new Set(jefaturasDeGerencia(currentRole==='director'?ROLES.gerencia.persona:_gerPersona).map(j=>j.n));
  const JS        = jefaturasCalc().filter(j=>_alcanceJef.has(j.n));  // A-01: solo jefaturas de su alcance
  /* Selector de jefatura: orden alfabético estable, independiente del desempeño del día.
     Usar JS (ordenada por logro) aquí haría que la jefatura líder cambiara de lugar en el
     dropdown catorcena a catorcena, y que la "primera" (usada como selección por defecto)
     fuera la de mejor desempeño en turno — no necesariamente la que tiene datos operativos
     cargados, lo que hacía ver el filtro como si "no funcionara". */
  const JS_SEL    = JS.slice().sort((a,b)=>a.n.localeCompare(b.n));
  const TODAS_JEF = JS;
  const DR        = diasRestantes();
  const TRANSC    = P('DURACION_CATORCENA')-DR;
  const CAT       = DB.catorcenaActual;
  const dictPend  = DB.dictaminaciones.filter(d=>d.estado==='VOBO_JEFATURA');

  // Filtros activos
  const vw  = window.gerView||'ejecutiva';
  const fJef= window.gerFiltroJef||'';
  const fEj = window.gerFiltroEj||'';
  const fMar= window.gerFiltroMarca||'';
  const fReg= window.gerFiltroRegion||'';

  // Helpers
  const colL=l=>colorLogro(l);
  const pct2=v=>(v*100).toFixed(1)+'%';
  const onGo=fn=>`go(currentRole==='director'?'tabDir':'tabGer');${fn}`;

  // ── SELECTOR DE VISTA ───────────────────────────────────────────────
  const selector=`
    <div style="display:flex;align-items:center;justify-content:space-between;
         flex-wrap:wrap;gap:12px;margin-bottom:20px">
      <div>
        <div style="font-size:20px;font-weight:800;color:var(--indigo);letter-spacing:-.3px">
          Tablero ${rolLabel==='Director'?'Director de Unidad':'de Gerencia'}
        </div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">
          Catorcena ${CAT} · ${DR} días para el cierre · Actualizado: ${fecha(HOY)}
        </div>
      </div>
      <div class="viewSelector" role="tablist" aria-label="Vista del tablero">
        <button class="viewTab ${vw==='ejecutiva'?'active':''}" role="tab" aria-selected="${vw==='ejecutiva'}"
          onclick="window.gerView='ejecutiva';window.gerFiltroJef='';window.gerFiltroEj='';window.gerFiltroMarca='';window.gerFiltroRegion='';go(currentRole==='director'?'tabDir':'tabGer')">
          📊 Vista por Ejecutivo
        </button>
        <button class="viewTab ${vw==='jefatura'?'active':''}" role="tab" aria-selected="${vw==='jefatura'}"
          onclick="window.gerView='jefatura';window.gerFiltroJef='';window.gerFiltroMarca='';window.gerFiltroRegion='';go(currentRole==='director'?'tabDir':'tabGer')">
          👤 Vista por Jefatura
        </button>
      </div>
    </div>`;

  // ══════════════════════════════════════════════════════════════════════
  // VISTA EJECUTIVA
  // ══════════════════════════════════════════════════════════════════════
  if(vw==='ejecutiva'){
    // Filtrar ejecutivos
    const allEjs=DB.ejecutivos.map(e=>{
      const ctas=DB.cuentas.filter(c=>c.ejecutivo===e.n);
      const jef=ctas[0]?.jefatura||'—';
      const marca=[...new Set(ctas.map(c=>c.marca))].filter(Boolean);
      const region=[...new Set(ctas.map(c=>c.region))].filter(Boolean);
      return{...e,jefatura:jef,marcas:marca,regiones:region,
        logro:e.meta?e.recuperado/e.meta:0,pctv:e.meta?e.recuperado/e.meta*100:0,
        cuentasArr:ctas};
    });
    const ejsProrrateados=aplicarFiltroEquipo(allEjs, fEj, fMar, fReg);
    const ejsFilt=ejsProrrateados.map(e=>({...e, cuentasArr: e._cuentasFiltro || e.cuentasArr}));

    // KPIs consolidados de ejecutivos filtrados
    const recTot=ejsFilt.reduce((a,e)=>a+e.recuperado,0);
    const metaTot=ejsFilt.reduce((a,e)=>a+e.meta,0);
    const logro=metaTot?recTot/metaTot:0;
    const proy=TRANSC>0?Math.round(recTot/TRANSC*P('DURACION_CATORCENA')):recTot;
    const faltante=Math.max(0,metaTot-recTot);
    const csTot=ejsFilt.flatMap(e=>e.cuentasArr);
    const ritmoReq=DR>0?Math.max(0,Math.round((metaTot-recTot)/DR)):0;
    const ritmoAct=TRANSC>0?Math.round(recTot/TRANSC):0;

    // Semáforo ejecutivos
    const enObj=ejsFilt.filter(e=>e.pctv>=P('UMBRAL_LOGRO_OBJETIVO')).length;
    const enRiesgo=ejsFilt.filter(e=>e.pctv>=P('UMBRAL_LOGRO_RIESGO')&&e.pctv<P('UMBRAL_LOGRO_OBJETIVO')).length;
    const bajObj=ejsFilt.filter(e=>e.pctv<P('UMBRAL_LOGRO_RIESGO')).length;

    // Alertas ejecutivos críticos
    const alertas=ejsFilt.filter(e=>e.pctv<P('UMBRAL_LOGRO_RIESGO')).slice(0,3);
    const comproms=DB.gestiones.filter(g=>['Promesa de pago','Convenio'].includes(g.tipo)
      &&g.compromiso&&g.estado!=='RECHAZADA'
      &&csTot.some(c=>c.id===g.cuentaId))
      .map(g=>{const cu=csTot.find(c=>c.id===g.cuentaId);return{...g,cu,dias:diasHasta(g.compromiso)};})
      .filter(x=>x.cu&&x.dias!==null&&x.dias<=10).sort((a,b)=>a.dias-b.dias);

    // Opciones de filtros
    const marcasOpts=[...new Set(DB.cuentas.map(c=>c.marca))].filter(Boolean).sort();
    const regionesOpts=[...new Set(DB.cuentas.map(c=>c.region))].filter(Boolean).sort();

    return selector
    // Filtros ejecutiva
    +`<div class="gerFilters">
        <label for="fGerEj1">Ejecutivo</label>
        <select id="fGerEj1" onchange="window.gerFiltroEj=this.value;go(currentRole==='director'?'tabDir':'tabGer')">
          <option value="">Todos los ejecutivos</option>
          ${allEjs.map(e=>`<option value="${esc(e.n)}" ${fEj===e.n?'selected':''}>${esc(e.n)}</option>`).join('')}
        </select>
        <label for="fGerMarca1">Marca</label>
        <select id="fGerMarca1" onchange="window.gerFiltroMarca=this.value;go(currentRole==='director'?'tabDir':'tabGer')">
          <option value="">Todas las marcas</option>
          ${marcasOpts.map(m=>`<option value="${esc(m)}" ${fMar===m?'selected':''}>${esc(m)}</option>`).join('')}
        </select>
        <label for="fGerRegion1">Región</label>
        <select id="fGerRegion1" onchange="window.gerFiltroRegion=this.value;go(currentRole==='director'?'tabDir':'tabGer')">
          <option value="">Todas las regiones</option>
          ${regionesOpts.map(r=>`<option value="${esc(r)}" ${fReg===r?'selected':''}>${esc(r)}</option>`).join('')}
        </select>
        <button class="clr-btn" ${(fEj||fMar||fReg)?'':'style="opacity:.4;cursor:default"'}
        onclick="${(fEj||fMar||fReg)?`window.gerFiltroEj='';window.gerFiltroMarca='';window.gerFiltroRegion='';go(currentRole==='director'?'tabDir':'tabGer')`:''}">
        ✕ Limpiar filtros
      </button>
        <div style="margin-left:auto;font-size:11px;color:var(--text3)">
          ${ejsFilt.length} ejecutivo${ejsFilt.length!==1?'s':''} · ${csTot.length} cuentas
        </div>
      </div>`
    + chipsFiltros([['Ejecutivo',fEj],['Marca',fMar],['Región',fReg]], "window.gerFiltroEj='';window.gerFiltroMarca='';window.gerFiltroRegion='';go(currentRole==='director'?'tabDir':'tabGer')")
    + ((fMar||fReg)?`<div class="note warn" style="margin-bottom:16px">
        <b>Nota sobre el filtro de ${fMar&&fReg?'marca y región':fMar?'marca':'región'}:</b> Recuperado y Meta son un estimado proporcional al saldo de cartera que coincide con el filtro — el sistema no registra el recuperado desglosado por marca o región. Cartera y Distribución sí son exactos.
      </div>`:'')

    // 6 Hero cards
    +`<div class="heroGrid6" style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px">
        <div class="dashCard primary">
          <div class="dcAccent"></div><div class="dcAccent2"></div>
          <div class="dck">Recuperado 💰</div>
          <div class="dcv">${fmt(recTot)}</div>
          <div class="progHero"><i style="width:${Math.min(100,logro*100)}%"></i></div>
          <div class="dcs">${pct2(logro)} de ${fmt(metaTot)}</div>
        </div>
        <div class="dashCard turq">
          <div class="dcAccent"></div><div class="dcAccent2"></div>
          <div class="dck">Proyección al cierre 📈</div>
          <div class="dcv">${fmt(proy)}</div>
          <div class="dcs">${metaTot?(proy>=metaTot?'+'+pct2((proy-metaTot)/metaTot)+' vs meta':'⚠ Por debajo de la meta'):'—'}</div>
        </div>
        ${(fMar||fReg)
          ? `<div class="dashCard lite" style="display:flex;flex-direction:column;justify-content:center">
          <div class="dck" style="color:var(--text3)">Cumplimiento 🎯</div>
          <div style="font-size:12.5px;font-weight:700;color:var(--text3);margin-top:6px;line-height:1.35">No disponible con este filtro</div>
          <div class="dcs" style="color:var(--text3);margin-top:4px">El recuperado no se registra desglosado por ${fMar&&fReg?'marca ni región':fMar?'marca':'región'}, así que el porcentaje no puede variar. Quita el filtro para verlo.</div>
        </div>`
          : `<div class="dashCard ${claseLogro(logro)}">
          <div class="dcAccent"></div><div class="dcAccent2"></div>
          <div class="dck">Cumplimiento 🎯</div>
          <div class="dcv">${pct2(logro)}</div>
          <div class="dcs">vs meta 100%</div>
        </div>`}
        <div class="dashCard lite" style="position:relative">
          <div style="position:absolute;right:14px;top:14px;font-size:20px">🚩</div>
          <div class="dck" style="color:var(--text3)">Faltante para meta</div>
          <div class="dcv" style="color:${faltante>0?'var(--red)':'var(--green)'}">${fmt(faltante)}</div>
          <div class="dcs" style="color:var(--text3)">Para alcanzar ${fmt(metaTot)}</div>
        </div>
        <div class="dashCard lite" style="position:relative">
          <div style="position:absolute;right:14px;top:14px;font-size:20px">👥</div>
          <div class="dck" style="color:var(--text3)">Cartera asignada</div>
          <div class="dcv" style="color:var(--indigo)">${csTot.length}</div>
          <div class="dcs" style="color:var(--text3)">Cuentas · ${fmt(csTot.reduce((a,c)=>a+c.saldoReal,0))}</div>
        </div>
        <div class="dashCard lite" style="position:relative;cursor:pointer" onclick="go('dictGer')">
          <div style="position:absolute;right:14px;top:14px;font-size:20px">📋</div>
          <div class="dck" style="color:var(--text3)">Por resolver</div>
          <div class="dcv" style="color:${dictPend.length?'var(--amber)':'var(--green)'}">${dictPend.length}</div>
          <div class="dcs" style="color:var(--text3)">${dictPend.length?'Esperando VoBo':'Sin pendientes ✓'}</div>
        </div>
      </div>`

    // Segunda fila: Salud equipo + Alertas + Compromisos
    +`<div class="tabJefeRow2" style="display:grid;grid-template-columns:1fr 1.4fr 1.4fr;gap:14px;margin-bottom:20px">
        <!-- Salud ejecutivos -->
        <div class="panel" style="margin:0">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px">Salud del equipo ejecutivo</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
            <div style="width:46px;height:46px;border-radius:50%;
                 background:${enObj>=ejsFilt.length*.6?'var(--green)':'var(--amber)'};
                 display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
              ${enObj>=ejsFilt.length*.6?'✓':'⚠'}
            </div>
            <div>
              <div style="font-size:13px;font-weight:800;color:${enObj>=ejsFilt.length*.6?'var(--green)':'var(--amber)'}">
                ${enObj>=ejsFilt.length*.6?'Equipo en objetivo':'Requiere intervención'}
              </div>
              <div style="font-size:11px;color:var(--text3);margin-top:2px">
                ${enObj} de ${ejsFilt.length} ejecutivos ≥ ${uObjetivoPct()}%
              </div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
            ${[{n:enObj,l:'En objetivo',sub:`≥ ${uObjetivoPct()}%`,col:'var(--green)'},
               {n:enRiesgo,l:'En riesgo',sub:`${uRiesgoPct()}–${uObjetivoPct()-1}%`,col:'var(--amber)'},
               {n:bajObj,l:'Bajo objetivo',sub:`< ${uRiesgoPct()}%`,col:'var(--red)'}].map(b=>`
              <div style="text-align:center;padding:10px 6px;border-radius:10px;
                   background:${b.n?b.col+'18':'var(--bg)'};border:1.5px solid ${b.n?b.col:'var(--line)'}">
                <div style="font-size:20px;font-weight:900;color:${b.n?b.col:'var(--text3)'}">${b.n}</div>
                <div style="font-size:9.5px;font-weight:700;color:${b.n?b.col:'var(--text3)'};margin-top:2px">${b.l}</div>
                <div style="font-size:9px;color:var(--text3)">${b.sub}</div>
              </div>`).join('')}
          </div>
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line);
               display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">
            <span style="color:var(--text3)">Rec. promedio</span>
            <span style="font-weight:700;color:var(--indigo);text-align:right">${fmt(Math.round(recTot/Math.max(1,ejsFilt.length)))}</span>
            <span style="color:var(--text3)">Ritmo diario req.</span>
            <span style="font-weight:700;color:${ritmoReq<=ritmoAct?'var(--green)':'var(--amber)'};text-align:right">${fmt(ritmoReq)}</span>
          </div>
        </div>

        <!-- Alertas prioritarias -->
        <div class="panel" style="margin:0">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px">
            ${alertas.length?'⚠️ Alertas prioritarias':'✅ Sin alertas críticas'}
          </div>
          ${alertas.length
            ? alertas.map(e=>`
              <div class="alertBlock crit">
                <div class="aIcon">🔴</div>
                <div class="aBody">
                  <div class="aTit">${esc(e.n)}</div>
                  <div class="aSub">${Math.round(e.pctv)}% cumplimiento · Faltante ${fmt(Math.max(0,e.meta-e.recuperado))} · ${cuentasReales(e.n)} cuentas</div>
                </div>
                <div class="aBtn"><button class="act sm o" onclick="window.gerFiltroEj='${esc(e.n)}';go(currentRole==='director'?'tabDir':'tabGer')">Ver detalle</button></div>
              </div>`).join('')
            : `<div class="alertBlock info"><div class="aIcon">🎉</div>
               <div class="aBody"><div class="aTit" style="color:var(--green)">Todos los ejecutivos en objetivo</div>
               <div class="aSub">Ningún ejecutivo está por debajo del 50% de cumplimiento.</div></div></div>`}
          ${comproms.filter(c=>c.dias<=5).length?`
            <div class="alertBlock warn" style="margin-top:8px">
              <div class="aIcon">📅</div>
              <div class="aBody">
                <div class="aTit">${comproms.filter(c=>c.dias<=5).length} compromisos vencen en 5 días</div>
                <div class="aSub">Monto total ${fmt(comproms.filter(c=>c.dias<=5).reduce((a,g)=>a+(g.monto||g.cu?.saldoReal||0),0))}</div>
              </div>
            </div>`:''}
        </div>

        <!-- Comparativo por jefatura -->
        <div class="panel" style="margin:0">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px">
            Cumplimiento por jefatura
          </div>
          ${TODAS_JEF.map(j=>{
            const ejsJ=ejsFilt.filter(e=>e.jefatura===j.n);
            const recJ=ejsJ.reduce((a,e)=>a+e.recuperado,0);
            const metaJ=ejsJ.reduce((a,e)=>a+e.meta,0);
            const logroJ=metaJ?recJ/metaJ:j.logro;
            const col=colL(logroJ);
            return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--line2)">
              <div style="font-size:12px;font-weight:600;color:var(--indigo);min-width:100px;max-width:110px;
                   overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(j.n.split(' ')[0])}</div>
              <div class="cmpBar" style="flex:1"><i style="width:${Math.min(100,logroJ*100)}%;background:${col}"></i></div>
              <div style="font-size:11.5px;font-weight:700;color:${col};min-width:38px;text-align:right;
                   font-variant-numeric:tabular-nums">${Math.round(logroJ*100)}%</div>
            </div>`;}).join('')}
        </div>
      </div>`

    // Distribución + Evolución
    +`<div class="tabJefeRow3" style="display:grid;grid-template-columns:1.1fr 1fr;gap:14px;margin-bottom:20px">
        <div class="panel" style="margin:0">
          <div style="display:flex;align-items:center;margin-bottom:12px">
            <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">Distribución de la cartera</div>
            <div style="margin-left:auto;font-size:11px;color:var(--text3)">Total: ${fmt(csTot.reduce((a,c)=>a+c.saldoReal,0))}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr auto auto;gap:6px 12px;
               font-size:9.5px;font-weight:700;color:var(--text3);margin-bottom:8px;
               padding-bottom:6px;border-bottom:1px solid var(--line)">
            <span></span><span style="text-align:right">Monto</span><span style="text-align:right">%</span>
          </div>
          ${CATALOGOS.ESTATUS_CUENTA.map(est=>{
            const cts=csTot.filter(c=>c.estatus===est);
            const sd=cts.reduce((a,c)=>a+c.saldoReal,0);
            const tot=csTot.reduce((a,c)=>a+c.saldoReal,0)||1;
            const pp=Math.round(sd/tot*100);
            const col=({'Liquidado':'var(--green)','En gestión':'var(--turq)','Con promesa vigente':'var(--amber)',
                        'Convenio activo':'var(--violet)','Dictaminación propuesta':'var(--violet)',
                        'Quebranto':'var(--red)','Liquidado pendiente Core':'var(--turql)'})[est]||'var(--text3)';
            return `<div style="display:grid;grid-template-columns:1fr auto auto;gap:6px 12px;
                 align-items:center;padding:7px 0;border-bottom:1px solid var(--line2)">
              <div style="display:flex;align-items:center;gap:8px;min-width:0">
                <span style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0"></span>
                <div style="min-width:0">
                  <div style="font-size:12px;font-weight:600;color:var(--indigo);
                       overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${est}</div>
                  <div class="miniProg" style="width:90px"><i style="width:${pp}%;background:${col}"></i></div>
                </div>
              </div>
              <div style="font-size:12px;font-weight:700;color:var(--indigo);text-align:right;white-space:nowrap">${fmt(sd)}</div>
              <div style="font-size:11px;color:var(--text3);text-align:right;white-space:nowrap">${pp}%</div>
            </div>`;}).join('')}
        </div>
        <div class="panel" style="margin:0">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">Evolución de recuperación</div>
          <div style="font-size:10.5px;color:var(--text3);margin-bottom:14px">Acumulado en catorcena ${CAT}</div>
          <div style="position:relative;height:150px;margin-bottom:12px">
            ${(()=>{
              const puntos=Array.from({length:Math.min(6,TRANSC||1)},(_,i)=>Math.round(recTot*(i+1)/(Math.min(6,TRANSC||1))));
              const maxV=Math.max(metaTot,Math.max(...puntos))*1.1||1;
              const W=400,H=130,PAD=8;
              const xs=puntos.map((_,i)=>PAD+i*(W-PAD*2)/(Math.max(1,puntos.length-1)));
              const ys=puntos.map(v=>H-PAD-(v/maxV)*(H-PAD*2));
              const metaY=H-PAD-(metaTot/maxV)*(H-PAD*2);
              const path='M'+xs.map((x,i)=>`${x.toFixed(0)},${ys[i].toFixed(0)}`).join(' L');
              const areaP=`${path} L${xs[xs.length-1].toFixed(0)},${H} L${PAD},${H} Z`;
              const lx=xs[xs.length-1],ly=ys[ys.length-1];
              return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
                <defs><linearGradient id="evGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#199C9A" stop-opacity=".22"/>
                  <stop offset="100%" stop-color="#199C9A" stop-opacity="0"/>
                </linearGradient></defs>
                <line x1="${PAD}" y1="${metaY.toFixed(0)}" x2="${W-PAD}" y2="${metaY.toFixed(0)}"
                      stroke="#353266" stroke-width="1.5" stroke-dasharray="5,4" opacity=".35"/>
                <text x="${W-PAD}" y="${(metaY-4).toFixed(0)}" text-anchor="end" font-size="9" fill="#353266" opacity=".5">Meta ${fmt(metaTot)}</text>
                <path d="${areaP}" fill="url(#evGrad2)"/>
                <polyline points="${xs.map((x,i)=>x.toFixed(0)+','+ys[i].toFixed(0)).join(' ')}"
                  fill="none" stroke="#199C9A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                <circle cx="${lx.toFixed(0)}" cy="${ly.toFixed(0)}" r="5" fill="#199C9A"/>
                <rect x="${lx-30}" y="${(ly-22).toFixed(0)}" width="60" height="18" rx="5" fill="#199C9A"/>
                <text x="${lx.toFixed(0)}" y="${(ly-10).toFixed(0)}" text-anchor="middle" font-size="9" font-weight="700" fill="white">${fmt(recTot)}</text>
              </svg>`;
            })()}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div style="background:var(--bg);border-radius:10px;padding:10px 12px">
              <div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px">Ritmo actual</div>
              <div style="font-size:17px;font-weight:800;color:var(--indigo);margin-top:2px">${fmt(ritmoAct)}</div>
              <div style="font-size:10px;color:var(--text3)">por día</div>
            </div>
            <div style="background:${ritmoReq<=ritmoAct?'rgba(30,142,90,.08)':'rgba(224,138,30,.08)'};
                 border-radius:10px;padding:10px 12px;border:1px solid ${ritmoReq<=ritmoAct?'rgba(30,142,90,.2)':'rgba(224,138,30,.2)'}">
              <div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px">Ritmo requerido</div>
              <div style="font-size:17px;font-weight:800;color:${ritmoReq<=ritmoAct?'var(--green)':'var(--amber)'};margin-top:2px">${fmt(ritmoReq)}</div>
              <div style="font-size:10px;color:${ritmoReq<=ritmoAct?'var(--green)':'var(--amber)'};font-weight:600">
                ${ritmoReq<=ritmoAct?'▲ En ritmo':'▼ Aumentar'}
              </div>
            </div>
          </div>
        </div>
      </div>`

    // Ranking de ejecutivos (tabla enriquecida)
    +`<div class="panel">
        <div style="display:flex;align-items:center;margin-bottom:16px">
          <div>
            <span style="font-size:15px;font-weight:800;color:var(--indigo)">Ranking de ejecutivos</span>
            <span style="font-size:11px;font-weight:500;color:var(--text3);margin-left:8px">${ejsFilt.length} ejecutivos · Catorcena ${CAT}</span>
          </div>
        </div>
        <div class="rankEjTbl" style="display:grid;grid-template-columns:32px 1fr 70px 80px 60px 140px 90px 100px;
             gap:8px;align-items:center;padding:0 0 8px;border-bottom:2px solid var(--line);
             font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">
          <span>#</span><span>Ejecutivo</span>
          <span class="rankCol-hide-tab" style="text-align:right">Cuentas</span>
          <span style="text-align:right">Recuperado</span>
          <span class="rankCol-hide-mob" style="text-align:right">Meta</span>
          <span style="text-align:center">Cumplimiento</span>
          <span style="text-align:right">Vs meta</span>
          <span style="text-align:right">Proyección</span>
        </div>
        ${ejsFilt.slice().sort((a,b)=>b.pctv-a.pctv).map((e,i)=>{
          const brecha=e.recuperado-e.meta;
          const proyE=TRANSC>0?Math.round(e.recuperado/TRANSC*P('DURACION_CATORCENA')):e.recuperado;
          const col=colL(e.logro);
          const medals=['🥇','🥈','🥉'];
          return `<div class="rankEjTbl" style="display:grid;grid-template-columns:32px 1fr 70px 80px 60px 140px 90px 100px;
               gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line2);
               ${e.pctv<P('UMBRAL_LOGRO_RIESGO')?'background:rgba(192,57,43,.03);border-radius:8px;padding:10px 8px;':''}">
            <div style="font-size:${i<3?'18':'13'}px;font-weight:700;text-align:center;color:var(--text3)">${medals[i]||i+1}</div>
            <div style="min-width:0">
              <div style="font-size:12.5px;font-weight:700;color:var(--indigo);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.n)}</div>
              <div style="font-size:10px;color:var(--text3)">${esc(e.jefatura)}</div>
            </div>
            <div class="rankCol-hide-tab" style="font-size:12px;font-weight:600;color:var(--indigo);text-align:right">${cuentasReales(e.n)}</div>
            <div style="font-size:12px;font-weight:700;color:var(--indigo);text-align:right;white-space:nowrap">${fmt(e.recuperado)}</div>
            <div class="rankCol-hide-mob" style="font-size:11px;color:var(--text3);text-align:right;white-space:nowrap">${fmt(e.meta)}</div>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="rankCol-hide-mob" style="flex:1;height:8px;background:var(--bg);border-radius:4px;overflow:hidden">
                <div style="height:100%;width:${Math.min(100,e.pctv)}%;background:${col};border-radius:4px"></div>
              </div>
              <span style="font-size:12px;font-weight:800;color:${col};min-width:34px;text-align:right;font-variant-numeric:tabular-nums">${Math.round(e.pctv)}%</span>
            </div>
            <div style="font-size:12px;font-weight:700;color:${brecha>=0?'var(--green)':'var(--red)'};text-align:right;white-space:nowrap">
              ${brecha>=0?'+':''}${fmt(brecha)}
            </div>
            <div style="text-align:right">
              <div style="font-size:12px;font-weight:700;color:var(--indigo);white-space:nowrap">${fmt(proyE)}</div>
              <div style="font-size:9px;color:${proyE>=e.meta?'var(--green)':'var(--red)'}">
                ${proyE>=e.meta?'↑ Alcanza':'↓ Bajo meta'}
              </div>
            </div>
          </div>`;}).join('')}
      </div>`;
  }

  // ══════════════════════════════════════════════════════════════════════
  // VISTA POR JEFATURA — reproduce exactamente el tabJefe filtrado
  // ══════════════════════════════════════════════════════════════════════
  /* La membresía del equipo se determina por reportaA (DB.usuarios), la fuente
     autoritativa de jerarquía. El campo cuenta.jefatura es una copia derivada que
     puede quedar incompleta si una cuenta no lo trae capturado (ocurría con Rodrigo
     Salas y Claudia Bermúdez) — usarlo como única fuente subestimaba el equipo real. */
  const jefSel = fJef
    || (JS_SEL.find(j=>DB.usuarios.some(u=>u.reportaA===j.n))?.n)
    || (JS_SEL[0]?.n||'');
  const jefObj = JS.find(j=>j.n===jefSel)||JS[0]||{};
  const ejsJefBase = DB.ejecutivos.filter(e=>{
    const u=DB.usuarios.find(x=>x.n===e.n);
    return u ? u.reportaA===jefSel : DB.cuentas.some(c=>c.ejecutivo===e.n&&c.jefatura===jefSel);
  });
  const nombresEjsJef = new Set(ejsJefBase.map(e=>e.n));
  const marcasOpts2=[...new Set(DB.cuentas.filter(c=>nombresEjsJef.has(c.ejecutivo)).map(c=>c.marca))].filter(Boolean).sort();
  const regionesOpts2=[...new Set(DB.cuentas.filter(c=>nombresEjsJef.has(c.ejecutivo)).map(c=>c.region))].filter(Boolean).sort();

  /* Marca/Región se prorratean sobre recuperado/meta de cada ejecutivo de esta jefatura
     (ver aplicarFiltroEquipo) — mismo criterio que Vista por Ejecutivo y que el propio
     tablero de la Jefatura, para que los tres sean consistentes entre sí. */
  const ejsJef = aplicarFiltroEquipo(ejsJefBase, '', fMar, fReg);
  // Filtrar cuentas de la jefatura seleccionada (por ejecutivo real de su equipo, no por el campo cuenta.jefatura)
  const csJef=DB.cuentas.filter(c=>nombresEjsJef.has(c.ejecutivo)
    &&(!fMar||c.marca===fMar)
    &&(!fReg||c.region===fReg));
  /* A-04: mismo criterio que ve la propia jefatura (PENDIENTE_VOBO de SU equipo),
     no VOBO_JEFATURA. Antes esta tarjeta mostraba otra métrica con el mismo nombre. */
  const _dictJefSel=DB.dictaminaciones.filter(d=>d.estado==='PENDIENTE_VOBO'&&nombresEjsJef.has(d.ejecutivo));
  const recJef=ejsJef.reduce((a,e)=>a+e.recuperado,0);
  /* meta siempre se deriva del equipo real, nunca del agregado estático de DB.jefaturas
     (ese campo puede quedar desactualizado si el equipo cambia — ya ocurrió antes). */
  const metaJef=ejsJef.reduce((a,e)=>a+e.meta,0)||1;
  const logroJef=metaJef?recJef/metaJef:0;
  const proyJef=TRANSC>0?Math.round(recJef/TRANSC*P('DURACION_CATORCENA')):recJef;
  const faltanteJef=Math.max(0,metaJef-recJef);
  const drJef=DR;
  const ritmoReqJef=drJef>0?Math.max(0,Math.round((metaJef-recJef)/drJef)):0;
  const ritmoActJef=TRANSC>0?Math.round(recJef/TRANSC):0;
  /* CQ-1: usan los mismos parámetros que el resto del sistema (antes .7/.5 literales). */
  const enObjJef=ejsJef.filter(e=>e.meta&&e.recuperado/e.meta>=uObjetivo()).length;
  const enRiesgoJef=ejsJef.filter(e=>e.meta&&e.recuperado/e.meta>=uRiesgo()&&e.recuperado/e.meta<uObjetivo()).length;
  const bajObjJef=ejsJef.filter(e=>e.meta&&e.recuperado/e.meta<uRiesgo()).length;
  const conGestJef=new Set(DB.gestiones.map(g=>g.cuentaId));
  const promsJef=DB.gestiones.filter(g=>['Promesa de pago','Convenio'].includes(g.tipo)
    &&g.compromiso&&g.estado!=='RECHAZADA'&&csJef.some(c=>c.id===g.cuentaId))
    .map(g=>{const cu=csJef.find(c=>c.id===g.cuentaId);return{...g,cu,dias:diasHasta(g.compromiso)};})
    .filter(x=>x.cu&&x.dias!==null&&x.dias<=15).sort((a,b)=>a.dias-b.dias);

  return selector
  // Filtros jefatura
  +`<div class="gerFilters">
      <label for="fGerJefatura1">Jefatura</label>
      <select id="fGerJefatura1" onchange="window.gerFiltroJef=this.value;window.gerFiltroMarca='';window.gerFiltroRegion='';go(currentRole==='director'?'tabDir':'tabGer')">
        ${JS.map(j=>`<option value="${esc(j.n)}" ${jefSel===j.n?'selected':''}>${esc(j.n)}</option>`).join('')}
      </select>
      <label for="fGerMarca2">Marca</label>
      <select id="fGerMarca2" onchange="window.gerFiltroMarca=this.value;go(currentRole==='director'?'tabDir':'tabGer')">
        <option value="">Todas las marcas</option>
        ${marcasOpts2.map(m=>`<option value="${esc(m)}" ${fMar===m?'selected':''}>${esc(m)}</option>`).join('')}
      </select>
      <label for="fGerRegion2">Región</label>
      <select id="fGerRegion2" onchange="window.gerFiltroRegion=this.value;go(currentRole==='director'?'tabDir':'tabGer')">
        <option value="">Todas las regiones</option>
        ${regionesOpts2.map(r=>`<option value="${esc(r)}" ${fReg===r?'selected':''}>${esc(r)}</option>`).join('')}
      </select>
      ${(fJef!==JS[0]?.n||fMar||fReg)?`<button class="clr-btn" onclick="window.gerFiltroJef='';window.gerFiltroMarca='';window.gerFiltroRegion='';go(currentRole==='director'?'tabDir':'tabGer')">✕ Limpiar filtros</button>`:''}
      <div style="margin-left:auto;font-size:11px;color:var(--text3)">
        ${csJef.length} cuentas · ${ejsJef.length} ejecutivos
      </div>
    </div>`

  // Nota aclaratoria
  +`<div class="note info" style="margin-bottom:18px">
      Estás viendo la jefatura de <b>${esc(jefSel)}</b> (${esc(jefObj.region||'—')}) con los mismos indicadores y filtros que visualiza esa jefatura.
    </div>`
  + chipsFiltros([['Jefatura',fJef],['Marca',fMar],['Región',fReg]], "window.gerFiltroMarca='';window.gerFiltroRegion='';go(currentRole==='director'?'tabDir':'tabGer')")
  + ((fMar||fReg)?`<div class="note warn" style="margin-bottom:18px">
      <b>Nota sobre el filtro de ${fMar&&fReg?'marca y región':fMar?'marca':'región'}:</b> Recuperado y Meta son un estimado proporcional al saldo de cartera que coincide con el filtro — el sistema no registra el recuperado desglosado por marca o región. Cartera y Distribución sí son exactos.
    </div>`:'')

  // 6 Hero cards de la jefatura
  +`<div class="heroGrid6" style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px">
      <div class="dashCard primary">
        <div class="dcAccent"></div><div class="dcAccent2"></div>
        <div class="dck">Recuperado 💰</div>
        <div class="dcv">${fmt(recJef)}</div>
        <div class="progHero"><i style="width:${Math.min(100,logroJef*100)}%"></i></div>
        <div class="dcs">${pct2(logroJef)} de ${fmt(metaJef)} · C${CAT}</div>
      </div>
      <div class="dashCard turq">
        <div class="dcAccent"></div><div class="dcAccent2"></div>
        <div class="dck">Proyección al cierre 📈</div>
        <div class="dcv">${fmt(proyJef)}</div>
        <div class="dcs">${metaJef?(proyJef>=metaJef?'+'+pct2((proyJef-metaJef)/metaJef)+' vs meta':'⚠ Por debajo de la meta'):'—'}</div>
      </div>
      ${(fMar||fReg)
        ? `<div class="dashCard lite" style="display:flex;flex-direction:column;justify-content:center">
        <div class="dck" style="color:var(--text3)">Cumplimiento 🎯</div>
        <div style="font-size:12.5px;font-weight:700;color:var(--text3);margin-top:6px;line-height:1.35">No disponible con este filtro</div>
        <div class="dcs" style="color:var(--text3);margin-top:4px">El recuperado no se registra desglosado por ${fMar&&fReg?'marca ni región':fMar?'marca':'región'}, así que el porcentaje no puede variar. Quita el filtro para verlo.</div>
      </div>`
        : `<div class="dashCard ${claseLogro(logroJef)}">
        <div class="dcAccent"></div><div class="dcAccent2"></div>
        <div class="dck">Cumplimiento 🎯</div>
        <div class="dcv">${pct2(logroJef)}</div>
        <div class="dcs">vs meta 100%</div>
      </div>`}
      <div class="dashCard lite" style="position:relative">
        <div style="position:absolute;right:14px;top:14px;font-size:20px">🚩</div>
        <div class="dck" style="color:var(--text3)">Faltante para meta</div>
        <div class="dcv" style="color:${faltanteJef>0?'var(--red)':'var(--green)'}">${fmt(faltanteJef)}</div>
        <div class="dcs" style="color:var(--text3)">Para alcanzar ${fmt(metaJef)}</div>
      </div>
      <div class="dashCard lite" style="position:relative">
        <div style="position:absolute;right:14px;top:14px;font-size:20px">👥</div>
        <div class="dck" style="color:var(--text3)">Cartera asignada</div>
        <div class="dcv" style="color:var(--indigo)">${csJef.length}</div>
        <div class="dcs" style="color:var(--text3)">Cuentas · ${fmt(csJef.reduce((a,c)=>a+c.saldoReal,0))}</div>
      </div>
      <div class="dashCard lite" style="position:relative">
        <div style="position:absolute;right:14px;top:14px;font-size:20px">📋</div>
        <div class="dck" style="color:var(--text3)">Por resolver</div>
        <div class="dcv" style="color:${_dictJefSel.length?'var(--amber)':'var(--green)'}">${_dictJefSel.length}</div>
        <div class="dcs" style="color:var(--text3)">${_dictJefSel.length?'Dictaminaciones':'Sin pendientes ✓'}</div>
      </div>
    </div>`

  // Salud + Alertas + Compromisos de la jefatura
  +`<div class="tabJefeRow2" style="display:grid;grid-template-columns:1fr 1.4fr 1.4fr;gap:14px;margin-bottom:20px">
      <div class="panel" style="margin:0">
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px">Salud del equipo</div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="width:46px;height:46px;border-radius:50%;
               background:${enObjJef>=ejsJef.length*.6?'var(--green)':'var(--amber)'};
               display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
            ${enObjJef>=ejsJef.length*.6?'✓':'⚠'}
          </div>
          <div>
            <div style="font-size:13px;font-weight:800;color:${enObjJef>=ejsJef.length*.6?'var(--green)':'var(--amber)'}">
              ${enObjJef>=ejsJef.length*.6?'Jefatura en objetivo':'Requiere intervención'}
            </div>
            <div style="font-size:11px;color:var(--text3);margin-top:2px">
              ${enObjJef} de ${ejsJef.length} ejecutivos ≥ ${uObjetivoPct()}%
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          ${[{n:enObjJef,l:'En objetivo',sub:`≥ ${uObjetivoPct()}%`,col:'var(--green)'},
             {n:enRiesgoJef,l:'En riesgo',sub:`${uRiesgoPct()}–${uObjetivoPct()-1}%`,col:'var(--amber)'},
             {n:bajObjJef,l:'Bajo objetivo',sub:`< ${uRiesgoPct()}%`,col:'var(--red)'}].map(b=>`
            <div style="text-align:center;padding:10px 6px;border-radius:10px;
                 background:${b.n?b.col+'18':'var(--bg)'};border:1.5px solid ${b.n?b.col:'var(--line)'}">
              <div style="font-size:20px;font-weight:900;color:${b.n?b.col:'var(--text3)'}">${b.n}</div>
              <div style="font-size:9.5px;font-weight:700;color:${b.n?b.col:'var(--text3)'};margin-top:2px">${b.l}</div>
              <div style="font-size:9px;color:var(--text3)">${b.sub}</div>
            </div>`).join('')}
        </div>
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px">
          <span style="color:var(--text3)">Rec. promedio</span>
          <span style="font-weight:700;color:var(--indigo);text-align:right">${fmt(Math.round(recJef/Math.max(1,ejsJef.length)))}</span>
          <span style="color:var(--text3)">Ritmo requerido</span>
          <span style="font-weight:700;color:${ritmoReqJef<=ritmoActJef?'var(--green)':'var(--amber)'};text-align:right">${fmt(ritmoReqJef)}</span>
        </div>
      </div>

      <!-- Alertas jefatura -->
      <div class="panel" style="margin:0">
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px">
          ${ejsJef.filter(e=>e.meta&&e.recuperado/e.meta<.5).length?'⚠️ Atención requerida':'✅ Sin alertas críticas'}
        </div>
        ${ejsJef.filter(e=>e.meta&&e.recuperado/e.meta<.5).slice(0,3).map(e=>`
          <div class="alertBlock crit">
            <div class="aIcon">🔴</div>
            <div class="aBody">
              <div class="aTit">${esc(e.n)}</div>
              <div class="aSub">${Math.round(e.recuperado/e.meta*100)}% cumplimiento · Faltante ${fmt(Math.max(0,e.meta-e.recuperado))}</div>
            </div>
          </div>`).join('')}
        ${ejsJef.filter(e=>e.meta&&e.recuperado/e.meta<.5).length===0?`
          <div class="alertBlock info"><div class="aIcon">🎉</div>
          <div class="aBody"><div class="aTit" style="color:var(--green)">Todos los ejecutivos en objetivo</div></div></div>`:''}
        ${promsJef.filter(p=>p.dias<=5).length?`
          <div class="alertBlock warn" style="margin-top:8px">
            <div class="aIcon">📅</div>
            <div class="aBody">
              <div class="aTit">${promsJef.filter(p=>p.dias<=5).length} compromisos vencen en 5 días</div>
              <div class="aSub">Monto ${fmt(promsJef.filter(p=>p.dias<=5).reduce((a,g)=>a+(g.monto||g.cu?.saldoReal||0),0))}</div>
            </div>
          </div>`:''}
      </div>

      <!-- Compromisos de la jefatura -->
      <div class="panel" style="margin:0">
        <div style="display:flex;align-items:center;margin-bottom:12px">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.6px">Próximos compromisos</div>
          <div style="margin-left:auto;font-size:10.5px;color:var(--text3)">${promsJef.length} total</div>
        </div>
        ${promsJef.length
          ? promsJef.slice(0,5).map(p=>{
              const est=p.dias<0?'Vencido':p.dias<=P('DIAS_COMPROMISO_URGENTE')?'Urgente':p.dias<=P('DIAS_COMPROMISO_PROXIMO')?'Próximo':'En fecha';
              const cls=p.dias<0?'a':p.dias<=3?'a':p.dias<=7?'m':'g';
              return `<div style="display:grid;grid-template-columns:1fr 65px 55px;gap:8px;
                   align-items:center;padding:7px 0;border-bottom:1px solid var(--line2)">
                <div style="min-width:0">
                  <div style="font-size:11.5px;font-weight:700;color:var(--indigo);
                       overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.cu.cliente)}</div>
                  <div style="font-size:10px;color:var(--text3)">${esc(p.cu.ejecutivo)}</div>
                </div>
                <div style="font-size:12px;font-weight:700;text-align:right;white-space:nowrap">${fmt(p.monto||p.cu.saldoReal)}</div>
                <div style="text-align:center"><span class="pill ${cls}" style="font-size:9px">${est}</span></div>
              </div>`;}).join('')
          : `<div class="empty">Sin compromisos próximos.</div>`}
      </div>
    </div>`

  // Distribución + Actividad
  +`<div class="cols2">
      <div class="panel">
        <h3>Distribución de la cartera <span style="font-size:11px;font-weight:500;color:var(--text3)">Saldo por estatus</span></h3>
        ${CATALOGOS.ESTATUS_CUENTA.map(est=>{
          const cts=csJef.filter(c=>c.estatus===est);
          const sd=cts.reduce((a,c)=>a+c.saldoReal,0);
          const tot=csJef.reduce((a,c)=>a+c.saldoReal,0)||1;
          const col=({'Liquidado':'var(--green)','En gestión':'var(--turq)','Con promesa vigente':'var(--amber)',
                      'Convenio activo':'var(--violet)','Dictaminación propuesta':'var(--violet)',
                      'Quebranto':'var(--red)','Liquidado pendiente Core':'var(--turql)'})[est]||'var(--text3)';
          return `<div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line2)">
            <span style="width:8px;height:8px;border-radius:50%;background:${col};flex-shrink:0"></span>
            <div style="flex:1;min-width:0">
              <div style="font-size:12px;font-weight:600;color:var(--indigo)">${est}</div>
              <div class="miniProg"><i style="width:${cts.length/(csJef.length||1)*100}%;background:${col}"></i></div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:13px;font-weight:800;color:var(--indigo)">${cts.length}</div>
              <div style="font-size:10.5px;color:var(--text3)">${fmt(sd)}</div>
            </div>
          </div>`;}).join('')}
      </div>
      <div class="panel">
        <h3>Actividad vs Recuperación <span style="font-size:11px;font-weight:500;color:var(--text3)">Por ejecutivo</span></h3>
        <div class="actRecGrid">${(()=>{
          const maxR=Math.max(1,...ejsJef.map(e=>e.recuperado));
          const maxG=Math.max(1,...ejsJef.map(e=>DB.gestiones.filter(g=>g.ejecutivo===e.n&&g.cat===CAT).length));
          return ejsJef.slice().sort((a,b)=>b.recuperado-a.recuperado).map(e=>{
            const ng=DB.gestiones.filter(g=>g.ejecutivo===e.n&&g.cat===CAT).length;
            const l=e.meta?e.recuperado/e.meta:0;
            const col=colL(l);
            return `<div class="actRecRow">
              <div class="arn">${esc(e.n.split(' ')[0])}</div>
              <div class="actRecBars">
                <div class="b1"><i style="width:${e.recuperado/maxR*100}%;background:${col}"><span>${fmt(e.recuperado)}</span></i></div>
                <div class="b2"><i style="width:${ng/maxG*100}%"></i></div>
              </div>
              <div class="actRecStat">
                <div class="pct" style="color:${col}">${Math.round(l*100)}%</div>
                <div class="gst">${ng} gest.</div>
              </div>
            </div>`;}).join('');
        })()}</div>
      </div>
    </div>`

  // Ranking ejecutivos de la jefatura
  +`<div class="panel">
      <div style="display:flex;align-items:center;margin-bottom:16px">
        <span style="font-size:15px;font-weight:800;color:var(--indigo)">Ranking de ejecutivos</span>
        <span style="font-size:11px;font-weight:500;color:var(--text3);margin-left:8px">${ejsJef.length} en ${esc(jefSel)}</span>
      </div>
      <div class="rankEjTbl" style="display:grid;grid-template-columns:32px 1fr 70px 80px 60px 140px 90px 100px;
           gap:8px;align-items:center;padding:0 0 8px;border-bottom:2px solid var(--line);
           font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">
        <span>#</span><span>Ejecutivo</span>
        <span class="rankCol-hide-tab" style="text-align:right">Cuentas</span>
        <span style="text-align:right">Recuperado</span>
        <span class="rankCol-hide-mob" style="text-align:right">Meta</span>
        <span style="text-align:center">Cumplimiento</span>
        <span style="text-align:right">Vs meta</span>
        <span style="text-align:right">Proyección</span>
      </div>
      ${ejsJef.slice().sort((a,b)=>(b.meta?b.recuperado/b.meta:0)-(a.meta?a.recuperado/a.meta:0)).map((e,i)=>{
        const l=e.meta?e.recuperado/e.meta:0;
        const brecha=e.recuperado-e.meta;
        const proyE=TRANSC>0?Math.round(e.recuperado/TRANSC*P('DURACION_CATORCENA')):e.recuperado;
        const col=colL(l);
        const medals=['🥇','🥈','🥉'];
        return `<div class="rankEjTbl" style="display:grid;grid-template-columns:32px 1fr 70px 80px 60px 140px 90px 100px;
             gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line2)">
          <div style="font-size:${i<3?'18':'13'}px;font-weight:700;text-align:center;color:var(--text3)">${medals[i]||i+1}</div>
          <div style="min-width:0">
            <div style="font-size:12.5px;font-weight:700;color:var(--indigo);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.n)}</div>
            <div style="font-size:10px;color:var(--text3)">C${CAT}</div>
          </div>
          <div class="rankCol-hide-tab" style="font-size:12px;font-weight:600;text-align:right">${cuentasReales(e.n)}</div>
          <div style="font-size:12px;font-weight:700;text-align:right;white-space:nowrap">${fmt(e.recuperado)}</div>
          <div class="rankCol-hide-mob" style="font-size:11px;color:var(--text3);text-align:right;white-space:nowrap">${fmt(e.meta)}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="rankCol-hide-mob" style="flex:1;height:8px;background:var(--bg);border-radius:4px;overflow:hidden">
              <div style="height:100%;width:${Math.min(100,l*100)}%;background:${col};border-radius:4px"></div>
            </div>
            <span style="font-size:12px;font-weight:800;color:${col};min-width:34px;text-align:right;font-variant-numeric:tabular-nums">${Math.round(l*100)}%</span>
          </div>
          <div style="font-size:12px;font-weight:700;color:${brecha>=0?'var(--green)':'var(--red)'};text-align:right;white-space:nowrap">
            ${brecha>=0?'+':''}${fmt(brecha)}
          </div>
          <div style="text-align:right">
            <div style="font-size:12px;font-weight:700;white-space:nowrap">${fmt(proyE)}</div>
            <div style="font-size:9px;color:${proyE>=e.meta?'var(--green)':'var(--red)'}">
              ${proyE>=e.meta?'↑ Alcanza':'↓ Bajo meta'}
            </div>
          </div>
        </div>`;}).join('')}
    </div>`;
}

VIEWS.tabGer=()=>renderTabGerDir('Gerencia');
VIEWS.tabDir=()=>renderTabGerDir('Director');




VIEWS.falcoForm=()=>head('Reportar Faltante (FALCO)','Comercial · captura de campo',
    'Reporte de faltante detectado en un grupo. Una vez enviado, la Jefatura de Recuperación lo asigna a un ejecutivo. El área comercial no gestiona el faltante, solo lo reporta.')
  + `<div class="cols2">
      <div class="panel"><h3>Datos del faltante</h3>
        <div class="field"><label for="nfLider">Líder de grupo</label><input id="nfLider" placeholder="Nombre completo"></div>
        <div class="field"><label for="nfGrupo">Grupo</label><input id="nfGrupo" placeholder="Ej. Grupo Las Flores"></div>
        <div class="field"><label for="nfRuta">Ruta</label><input id="nfRuta" placeholder="Ej. R-04"></div>
        <div class="field"><label for="nfReg">Región</label><select id="nfReg"><option>Jalisco</option><option>Nayarit</option><option>Colima</option></select></div>
        <div class="field"><label for="nfMot">Motivo</label><select id="nfMot">${CATALOGOS.MOTIVO_FALCO.map(m=>`<option>${m}</option>`).join('')}</select></div>
      </div>
      <div class="panel"><h3>Alcance e impacto</h3>
        <div class="field"><label for="nfMonto">Monto involucrado</label><input type="number" id="nfMonto" placeholder="0"></div>
        <div class="field"><label for="nfCli">Clientes afectados</label><input type="number" id="nfCli" placeholder="0"></div>
        <div class="field"><label for="nfTel">Teléfono de contacto de la ruta</label><input id="nfTel" placeholder="33-0000-0000"></div>
        <div class="field"><label for="nfDesc">Descripción de lo ocurrido</label><textarea id="nfDesc" placeholder="Narra los hechos de forma objetiva, sin atribuir responsabilidad."></textarea></div>
        <div class="note warn">El reporte no constituye una acusación. Describe hechos verificables; la aclaración corresponde a Recuperación bajo el protocolo FALCO.</div>
        <button class="act" onclick="enviarFalco()">Enviar reporte</button>
      </div>
    </div>`;
function enviarFalco(){
  const g=id=>(document.getElementById(id)||{}).value||'';
  if(!g('nfLider').trim()||!g('nfGrupo').trim()||!g('nfMonto')){toast('Captura líder, grupo y monto.','bad');return;}
  const f={id:'F-'+Math.floor(2210+Math.random()*80),lider:g('nfLider'),grupo:g('nfGrupo'),ruta:g('nfRuta')||'—',
    region:g('nfReg'),motivo:g('nfMot'),fecha:fecha(HOY),tel:g('nfTel')||'—',
    adeudo:Number(g('nfMonto')),nCli:Number(g('nfCli'))||0,estatus:'RECIBIDO',repPor:ROLES[currentRole].persona+' (Comercial)',ejec:null};
  DB.falcos.unshift(f);
  log('Reporte de FALCO',`${f.id} · ${f.lider} · ${f.grupo} · ${fmt(f.adeudo)}`,g('nfDesc'),null,'RECIBIDO');
  toast(`Reporte ${f.id} enviado. Cambia a Jefatura para verlo en la bandeja de asignación.`,'ok');
  go('falcoForm');
}

VIEWS.consultaCom=()=>{
  // Solo los FALCOs reportados por este usuario comercial
  const persona=ROLES[currentRole]?.persona||'';
  const misFalcos=DB.falcos.filter(f=>f.repPor&&f.repPor.includes(persona.split(' ')[0]));
  // Para cada FALCO, obtener la cuenta asociada al grupo del FALCO
  const cuentasIds=new Set(misFalcos.map(f=>f.grupo));
  const cs=DB.cuentas.filter(c=>misFalcos.some(f=>f.grupo===c.grupo));

  return head('Consulta de Cuentas','Comercial · solo lectura',
    'Aquí puedes ver el estado de recuperación de los casos FALCO que tú reportaste. La información es de solo lectura.')
  + kpi([
      {n:misFalcos.length,l:'FALCOs reportados por ti'},
      {n:misFalcos.filter(f=>f.estatus==='EN_GESTION').length,l:'En gestión activa',cls:'up'},
      {n:misFalcos.filter(f=>f.estatus==='ESCALADO').length,l:'Escalados',cls:'down'},
      {n:misFalcos.filter(f=>f.estatus==='RECUPERADO').length,l:'Recuperados',cls:'up'}
    ])
  + (misFalcos.length===0?`<div class="panel"><div class="empty">No has reportado ningún FALCO aún. Usa la opción "Reportar FALCO" para registrar un nuevo caso.</div></div>`:
  `<div class="panel">
    <h3>Casos FALCO que reportaste</h3>
    <table class="tbl" style="width:100%">
      <thead><tr>
        <th>FALCO</th><th>Líder / Grupo</th><th>Motivo</th><th>Ejecutivo</th><th>Clientes</th><th>Monto</th><th>Estatus</th><th></th>
      </tr></thead>
      <tbody>
        ${misFalcos.map(f=>{
          const cu=DB.cuentas.find(c=>c.grupo===f.grupo);
          return `<tr>
            <td><b>${f.id}</b><br><span style="font-size:10px;color:var(--text3)">${f.fecha}</span></td>
            <td>${esc(f.lider)}<br><span style="font-size:11px;color:var(--text3)">${esc(f.grupo)} · ${f.ruta}</span></td>
            <td style="font-size:12px">${esc(f.motivo)}</td>
            <td>${f.ejec?esc(f.ejec):'<span class="pill n">Sin asignar</span>'}</td>
            <td style="text-align:center">${f.nCli}</td>
            <td>${fmt(f.adeudo)}</td>
            <td><span class="pill ${f.estatus==='EN_GESTION'?'m':f.estatus==='ESCALADO'?'a':f.estatus==='RECUPERADO'?'g':'n'}">${labelEstatusFalco(f.estatus)}</span></td>
            <td>${cu?`<button class="act sm o" onclick="go('detalle','${cu.id}')">Ver cuenta</button>`:''}</td>
          </tr>`;}).join('')}
      </tbody>
    </table>
    <div class="note" style="margin-top:12px">
      Esta vista muestra únicamente los FALCOs que tú reportaste. El seguimiento de recuperación lo realiza el ejecutivo asignado.
    </div>
  </div>`);
};

/* ══════════════════════════════════════════════════════════════════
   13. VISTAS · ADMINISTRACIÓN DE SEGURIDAD
   ══════════════════════════════════════════════════════════════════ */
VIEWS.usuarios=()=>{
  if(typeof window.usuBusq==='undefined') window.usuBusq='';
  if(typeof window.usuFiltroRol==='undefined') window.usuFiltroRol='';
  if(typeof window.usuFiltroEst==='undefined') window.usuFiltroEst='';
  const busq=(window.usuBusq||'').toLowerCase().trim();
  const fRol=window.usuFiltroRol||'';
  const fEst=window.usuFiltroEst||'';
  const hasFiltro=busq||fRol||fEst;

  // Alertas de seguridad prioritarias
  const hoy=HOY;
  const alertas=[];
  DB.usuarios.forEach((u,i)=>{
    if(u.intentosFallidos>=3) alertas.push({tipo:'critica',icon:'🔐',
      msg:`${esc(u.n)} — ${u.intentosFallidos} intentos fallidos de acceso`,
      accion:`Bloquear cuenta`,onclick:`bloquearAlerta(${i})`});
    // MFA es opcional — no se genera alerta por falta de MFA
    if(u.passVence){
      const partes=u.passVence.split('-');
      const vence=new Date(`20${partes[2]}-${{'ene':'01','feb':'02','mar':'03','abr':'04','may':'05','jun':'06','jul':'07','ago':'08','sep':'09','oct':'10','nov':'11','dic':'12'}[partes[1]]}-${partes[0]}`);
      const diasRestantes=Math.round((vence-hoy)/86400000);
      if(diasRestantes<=30&&diasRestantes>=0&&u.estatus==='Activo') alertas.push({tipo:'warn',icon:'⏳',
        msg:`${esc(u.n)} — Contraseña vence en ${diasRestantes} días (${u.passVence})`,
        accion:'Notificar',onclick:`toast('Notificación enviada a ${esc(u.c)}','ok')`});
      if(diasRestantes<0&&u.estatus==='Activo') alertas.push({tipo:'critica',icon:'⛔',
        msg:`${esc(u.n)} — Contraseña vencida hace ${Math.abs(diasRestantes)} días`,
        accion:'Forzar cambio',onclick:`toast('Se forzará cambio de contraseña en el próximo ingreso.','ok')`});
    }
  });

  // Sesiones activas
  const sesionesTotal=DB.usuarios.reduce((a,u)=>a+(u.sesionesActivas||0),0);

  // Filtrar usuarios
  let lista=DB.usuarios.filter(u=>
    (!busq||(u.n+' '+u.c+' '+u.rol+' '+(u.regiones||[]).join(' ')+' '+(u.marcas||[]).join(' ')+' '+(u.unidadNegocio||'')+' '+(u.reportaA||'')).toLowerCase().includes(busq))&&
    (!fRol||u.rol===fRol)&&
    (!fEst||u.estatus===fEst)
  );

  const rolesOpts=[...new Set(DB.usuarios.map(u=>u.rol))].sort();

  return head('Usuarios','Administración de Seguridad · identidad',
    'Gestión de cuentas de acceso al sistema. Cada alta, modificación, bloqueo y cierre de sesión queda en bitácora inmutable. El AdminSeg NO tiene visibilidad de cartera, montos ni gestiones — separación de deberes deliberada.')

  // ── KPIs de seguridad ────────────────────────────────────────────
  + kpi([
      {n:DB.usuarios.length,                                          l:'Usuarios registrados'},
      {n:DB.usuarios.filter(u=>u.estatus==='Activo').length,          l:'Activos', cls:'up', d:`${sesionesTotal} sesiones ahora`},
      {n:DB.usuarios.filter(u=>u.estatus!=='Activo').length,          l:'Bloqueados', cls:DB.usuarios.filter(u=>u.estatus!=='Activo').length?'down':'up'},
      {n:DB.usuarios.filter(u=>u.sesionesActivas>0).reduce((a,u)=>a+(u.sesionesActivas||0),0), l:'Sesiones activas ahora', cls:'up'},
    ])

  // ── Alertas de seguridad ────────────────────────────────────────
  + (alertas.length?`<div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;
           letter-spacing:.5px;margin-bottom:8px">🔔 Alertas de seguridad — ${alertas.length} item${alertas.length!==1?'s':''}</div>
      ${alertas.map(a=>`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:10px;
             background:${a.tipo==='critica'?'rgba(192,57,43,.08)':'rgba(224,138,30,.07)'};
             border-left:3px solid ${a.tipo==='critica'?'var(--red)':'var(--amber)'};
             margin-bottom:6px">
          <span style="font-size:18px;flex-shrink:0">${a.icon}</span>
          <span style="flex:1;font-size:12px;color:var(--text2)">${a.msg}</span>
          <button class="act sm ${a.tipo==='critica'?'r':'o'}" onclick="${a.onclick}">${a.accion}</button>
        </div>`).join('')}
    </div>`:
    `<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:10px;
         background:rgba(30,142,90,.07);border-left:3px solid var(--green);margin-bottom:16px">
      <span style="font-size:18px">✅</span>
      <span style="font-size:12px;color:var(--text2)">Sin alertas críticas de seguridad en este momento.</span>
    </div>`)

  // ── Barra de herramientas ────────────────────────────────────────
  + `<div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center">
      <input type="search" placeholder="Buscar por nombre, correo o perfil…"
        style="flex:1;min-width:200px;padding:8px 12px;border:1.5px solid var(--line);
               border-radius:9px;font-size:12px;background:var(--surface)"
        value="${esc(window.usuBusq||'')}"
        oninput="window.usuBusq=this.value;go('usuarios')">
      <select style="padding:8px 10px;border:1.5px solid var(--line);border-radius:9px;
             font-size:12px;background:var(--surface)"
        onchange="window.usuFiltroRol=this.value;go('usuarios')">
        <option value="">Todos los perfiles</option>
        ${rolesOpts.map(r=>`<option value="${esc(r)}" ${fRol===r?'selected':''}>${esc(r)}</option>`).join('')}
      </select>
      <select style="padding:8px 10px;border:1.5px solid var(--line);border-radius:9px;
             font-size:12px;background:var(--surface)"
        onchange="window.usuFiltroEst=this.value;go('usuarios')">
        <option value="">Todos los estatus</option>
        <option value="Activo" ${fEst==='Activo'?'selected':''}>Activo</option>
        <option value="Bloqueado" ${fEst==='Bloqueado'?'selected':''}>Bloqueado</option>
      </select>
      <button class="act o sm" ${hasFiltro?'':'style="opacity:.4;cursor:default"'}
        onclick="${hasFiltro?`window.usuBusq='';window.usuFiltroRol='';window.usuFiltroEst='';go('usuarios')`:''}">
        ✕ Limpiar
      </button>
      <button class="act" onclick="nuevoUsuario()" style="margin-left:auto">+ Nuevo usuario</button>
    </div>`

  // ── Lista de usuarios como cards ─────────────────────────────────
  + (lista.length===0?`<div class="empty">Sin usuarios que coincidan con los filtros.</div>`:
    `<div style="display:flex;flex-direction:column;gap:8px">
      ${lista.map((u,_i)=>{
        const i=DB.usuarios.indexOf(u);
        const activo=u.estatus==='Activo';
        const riesgoMfa=!u.mfa&&activo;
        const riesgoIntentos=u.intentosFallidos>=3;
        // Días para vencimiento de contraseña
        let diasPass=null;
        if(u.passVence){
          const pp=u.passVence.split('-');
          const mMap={'ene':'01','feb':'02','mar':'03','abr':'04','may':'05','jun':'06','jul':'07','ago':'08','sep':'09','oct':'10','nov':'11','dic':'12'};
          const vf=new Date(`20${pp[2]}-${mMap[pp[1]]}-${pp[0]}`);
          diasPass=Math.round((vf-hoy)/86400000);
        }
        const passColor=diasPass===null?'var(--text3)':diasPass<0?'var(--red)':diasPass<=30?'var(--amber)':'var(--green)';
        const passLabel=diasPass===null?'—':diasPass<0?`Vencida (${Math.abs(diasPass)}d)`:diasPass<=30?`Vence en ${diasPass}d`:`OK (${diasPass}d)`;
        const iniciales=u.n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
        const colorRol={'Ejecutivo de Recuperación':'var(--turq)','Jefatura de Recuperación':'var(--indigo)',
          'Gerencia de Recuperación':'var(--indigo)','Director de Unidad de Negocio':'#7C3AED',
          'Jefatura Comercial':'#EA580C','Administrador de Seguridad':'var(--red)',
          'Administrador de Configuración':'var(--amber)','Especialista de Información y Control':'var(--green)'}[u.rol]||'var(--indigo)';
        return `<div style="background:var(--surface);border:1.5px solid ${riesgoIntentos?'var(--red)':riesgoMfa?'var(--amber)':'var(--line)'};
                     border-radius:12px;padding:14px 18px;display:grid;
                     grid-template-columns:52px 1fr auto;gap:14px;align-items:center">
          <!-- Avatar -->
          <div style="width:44px;height:44px;border-radius:12px;background:${colorRol};opacity:${activo?1:.5};
               display:flex;align-items:center;justify-content:center;font-size:15px;
               font-weight:800;color:#fff;flex-shrink:0">${iniciales}</div>
          <!-- Info -->
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
              <span style="font-size:14px;font-weight:800;color:${activo?'var(--indigo)':'var(--text3)'}">${esc(u.n)}</span>
              <span class="pill ${activo?'g':'a'}" style="font-size:9.5px">${u.estatus}</span>
              ${u.mfa?'<span class="pill g" style="font-size:9px;background:rgba(30,142,90,.12);color:#166534">🛡 MFA</span>':'<span class="pill a" style="font-size:9px">⚠ Sin MFA</span>'}
              ${u.sesionesActivas>0?`<span class="pill b" style="font-size:9px">● ${u.sesionesActivas} sesión activa</span>`:''}
              ${u.intentosFallidos>=3?`<span class="pill a" style="font-size:9px">🔐 ${u.intentosFallidos} intentos fallidos</span>`:''}
            </div>
            <div style="font-size:11.5px;color:var(--text3);margin-bottom:6px">${esc(u.c)}</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
              <span style="font-size:11px;color:var(--text3)">👤 ${esc(u.rol)}</span>
              ${u.reportaA?`<span style="font-size:11px;color:var(--text3)">↑ Reporta a: <b>${esc(u.reportaA)}</b></span>`:''}
              <span style="font-size:11px;color:var(--text3)">🏢 ${esc(u.unidadNegocio||u.pais||'—')}</span>
              <span style="font-size:11px;color:var(--text3)">🕐 ${u.ultimo}</span>
              <span style="font-size:11px;color:${passColor}" title="Ver detalles en Editar">🔑 ${diasPass===null?'—':diasPass<0?'Vencida ⚠️':diasPass<=7?'Vence pronto ⚠️':'Vigente ✓'}</span>
            </div>
            ${(u.marcas&&u.marcas.length>0)||(u.regiones&&u.regiones.length>0)?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
              ${(u.marcas||[]).map(m=>`<span style="font-size:10px;font-weight:600;padding:2px 8px;
                border-radius:20px;background:rgba(53,50,102,.1);color:var(--indigo);border:1px solid rgba(53,50,102,.2)">
                🏷 ${esc(m)}</span>`).join('')}
              ${(u.regiones||[]).map(r=>`<span style="font-size:10px;font-weight:600;padding:2px 8px;
                border-radius:20px;background:rgba(25,156,154,.08);color:var(--turq);border:1px solid rgba(25,156,154,.25)">
                📍 ${esc(r)}</span>`).join('')}
            </div>`:''}
          </div>
          <!-- Acciones -->
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;min-width:110px">
            <button class="act sm o" style="width:110px" onclick="editarUsuario(${i})">✏ Editar</button>
            <button class="act sm ${activo?'r':''}" style="width:110px" onclick="toggleUsuario(${i})">
              ${activo?'🔒 Bloquear':'🔓 Activar'}
            </button>
            <button class="act sm o" style="width:110px;font-size:10.5px" onclick="cerrarSesion(${i})">⏏ Cerrar sesión</button>
            ${u.intentosFallidos>=4?`<button class="act sm o" style="width:110px;font-size:10.5px" onclick="resetIntentos(${i})">↺ Reset intentos</button>`:''}
            <button class="act sm o" style="width:110px;font-size:10.5px;color:var(--red);border-color:var(--red)" onclick="eliminarUsuario(${i})">🗑 Eliminar</button>
          </div>
        </div>`;}).join('')}
    </div>`)

  + `<div style="font-size:11px;color:var(--text3);text-align:right;margin-top:10px">
      Mostrando ${lista.length} de ${DB.usuarios.length} usuarios · Todo cambio queda en bitácora
    </div>`;
};
/* ── Funciones AdminSeg — todas con motivo obligatorio y bitácora ── */
function bloquearAlerta(i){
  const u=DB.usuarios[i];
  modal(`<h3>🔒 Bloquear cuenta — ${esc(u.n)}</h3>
    <div class="note bad">Esta cuenta tiene ${u.intentosFallidos} intentos fallidos. Se recomienda bloquear preventivamente y notificar al usuario.</div>
    <div class="field"><label for="bM">Motivo</label><textarea id="bM" placeholder="Ej. Bloqueo preventivo por intentos fallidos reiterados. Ticket SEG-${Math.floor(Math.random()*9000+1000)}."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act r" onclick="
        const m=(document.getElementById('bM')||{}).value||'';
        if(!m.trim()){toast('El motivo es obligatorio.','bad');return;}
        DB.usuarios[${i}].estatus='Bloqueado';
        DB.usuarios[${i}].sesionesActivas=0;
        log('Bloqueo de usuario',esc(DB.usuarios[${i}].n),m,'Activo','Bloqueado');
        closeModal();toast('Cuenta bloqueada. Registrado en bitácora.','bad');go('usuarios');">
        Confirmar bloqueo
      </button></div>`);
}
function resetIntentos(i){
  const u=DB.usuarios[i];
  modal(`<h3>↺ Resetear intentos fallidos — ${esc(u.n)}</h3>
    <div class="note warn">Se reiniciará el contador de ${u.intentosFallidos} intentos fallidos. Solo procede si el usuario ha sido verificado.</div>
    <div class="field"><label for="rM">Motivo y evidencia de verificación</label>
      <textarea id="rM" placeholder="Ej. Usuario verificó identidad vía videollamada supervisada. Ticket SEG-XXXX."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="
        const m=(document.getElementById('rM')||{}).value||'';
        if(!m.trim()){toast('El motivo es obligatorio.','bad');return;}
        const prev=DB.usuarios[${i}].intentosFallidos;
        DB.usuarios[${i}].intentosFallidos=0;
        log('Reseteo de intentos fallidos',esc(DB.usuarios[${i}].n),m,prev+' intentos','0 intentos');
        closeModal();toast('Intentos reseteados. Registrado en bitácora.','ok');go('usuarios');">
        Confirmar reset
      </button></div>`);
}
function nuevoUsuario(){
  // Opciones de jefatura para mostrar en "Reporta a"
  const jefes=DB.usuarios.filter(u=>['Jefatura de Recuperación','Gerencia de Recuperación','Director de Unidad de Negocio'].includes(u.rol)&&u.estatus==='Activo').map(u=>u.n);
  const marcasDisp=CATALOGOS.MARCAS_CREDITO||[];
  const regionesDisp=CATALOGOS.REGIONES||[];

  modal(`<h3>➕ Nuevo usuario</h3>
    <div class="msub">Todos los campos son obligatorios. El usuario recibirá sus credenciales por correo y deberá cambiar la contraseña en el primer ingreso.</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
      <div class="field"><label for="uN">Nombre completo</label><input id="uN" placeholder="Nombre Apellido"></div>
      <div class="field"><label for="uC">Correo corporativo</label><input id="uC" placeholder="nombre.apellido@finvivir.com"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
      <div class="field"><label for="uPass">Contraseña inicial</label>
        <div style="position:relative">
          <input type="password" id="uPass" placeholder="Mínimo 10 caracteres">
          <button onclick="const f=document.getElementById('uPass');f.type=f.type==='password'?'text':'password'"
            style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:14px;color:var(--text3)">👁</button>
        </div>
        <div style="font-size:10.5px;color:var(--text3);margin-top:3px">Mín. 10 caracteres, mayúsculas, números y símbolo. El usuario deberá cambiarla al primer ingreso.</div>
      </div>
      <div class="field"><label for="uPass2">Confirmar contraseña</label>
        <input type="password" id="uPass2" placeholder="Repetir contraseña"></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
      <div class="field"><label for="uR">Perfil de acceso</label>
        <select id="uR" onchange="mostrarCamposRol()">${Object.values(ROLES).map(r=>`<option>${r.label}</option>`).join('')}</select></div>
      <div class="field"><label for="uJefe">Reporta a (jefe directo)</label>
        <select id="uJefe"><option value="">— Sin jerarquía —</option>${jefes.map(j=>`<option>${j}</option>`).join('')}</select></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
      <div class="field"><label for="uP">País / Unidad de Negocio</label>
        <select id="uP">${(CATALOGOS.PAISES_ACTIVOS||[]).map(pz=>`<option>${pz}</option>`).join('')}<option>Global</option></select></div>
      <div class="field"><label for="uMFA">MFA</label>
        <select id="uMFA"><option value="true">✅ Activado (recomendado)</option><option value="false">⚠️ No activado (justificar)</option></select></div>
    </div>

    <!-- Marcas asignadas (visible para Ejecutivo y Jefatura) -->
    <fieldset class="field" id="campoMarcas">
      <legend>Marcas que gestiona <span style="font-size:10px;color:var(--text3)">(selecciona una o más)</span></legend>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${marcasDisp.map(m=>`<label style="display:flex;align-items:center;gap:6px;font-size:12px;
          padding:4px 10px;border:1.5px solid var(--line);border-radius:20px;cursor:pointer">
          <input type="checkbox" name="uMarca" value="${m}" style="accent-color:var(--turq)"> ${m}
        </label>`).join('')}
      </div>
    </fieldset>

    <!-- Regiones asignadas -->
    <fieldset class="field" id="campoRegiones">
      <legend>Regiones que gestiona <span style="font-size:10px;color:var(--text3)">(selecciona una o más)</span></legend>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${regionesDisp.map(r=>`<label style="display:flex;align-items:center;gap:6px;font-size:12px;
          padding:4px 10px;border:1.5px solid var(--line);border-radius:20px;cursor:pointer">
          <input type="checkbox" name="uRegion" value="${r}" style="accent-color:var(--turq)"> ${r}
        </label>`).join('')}
      </div>
    </fieldset>

    <div class="field"><label>Motivo del alta <span style="font-size:10px;color:var(--text3)">(incluir referencia a ticket RH y quién autoriza)</span></label>
      <textarea id="uM" placeholder="Ej. Ingreso de nuevo ejecutivo zona Bajío. Ticket RH-4471. Autorizado por Laura Méndez el 01-sep-2026."></textarea></div>

    <div class="note warn">La contraseña inicial debe cumplir la política de seguridad. El sistema la marcará como "vence en 7 días" y forzará cambio al primer ingreso.</div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="guardarUsuario()">➕ Crear usuario</button></div>`);
}
function guardarUsuario(){
  const v=id=>(document.getElementById(id)||{}).value||'';
  const pass=v('uPass'), pass2=v('uPass2');
  // Validaciones
  if(!v('uN').trim()||!v('uC').trim()||!pass||!v('uM').trim()){
    toast('Nombre, correo, contraseña y motivo son obligatorios.','bad');return;}
  if(!v('uC').toLowerCase().includes('@finvivir')){
    toast('El correo debe ser corporativo (@finvivir.com o dominio del país).','bad');return;}
  if(pass.length<10){
    toast('La contraseña debe tener al menos 10 caracteres.','bad');return;}
  if(!/[A-Z]/.test(pass)||!/[0-9]/.test(pass)||!/[^A-Za-z0-9]/.test(pass)){
    toast('La contraseña debe tener mayúsculas, números y al menos un símbolo especial.','bad');return;}
  if(pass!==pass2){
    toast('Las contraseñas no coinciden.','bad');return;}
  // Recoger marcas y regiones seleccionadas
  const marcas=[...document.querySelectorAll('input[name="uMarca"]:checked')].map(c=>c.value);
  const regiones=[...document.querySelectorAll('input[name="uRegion"]:checked')].map(c=>c.value);
  const hoy=HOY;
  const mv={'01':'ene','02':'feb','03':'mar','04':'abr','05':'may','06':'jun','07':'jul','08':'ago','09':'sep','10':'oct','11':'nov','12':'dic'};
  const d7=new Date(hoy); d7.setDate(d7.getDate()+7);
  const passVence=`${String(d7.getDate()).padStart(2,'0')}-${mv[String(d7.getMonth()+1).padStart(2,'0')]}-${String(d7.getFullYear()).slice(2)}`;
  const altaFmt=`${String(hoy.getDate()).padStart(2,'0')}-${mv[String(hoy.getMonth()+1).padStart(2,'0')]}-${String(hoy.getFullYear()).slice(2)}`;
  const nuevo={n:v('uN'),c:v('uC'),rol:v('uR'),pais:v('uP')||'México',
    unidadNegocio:v('uP')||'México', reportaA:v('uJefe')||null,
    marcas,regiones,
    estatus:'Activo',ultimo:'Sin ingresos',alta:altaFmt,
    intentosFallidos:0,mfa:v('uMFA')==='true',
    passVence,sesionesActivas:0,primerIngreso:true};
  DB.usuarios.push(nuevo);
  log('Alta de usuario',`${v('uN')} · ${v('uR')} · ${v('uP')} · Reporta a: ${v('uJefe')||'N/A'}`,v('uM'),null,'Activo');
  closeModal();
  toast(`Usuario ${v('uN')} creado. Credenciales enviadas a ${v('uC')}.`,'ok');
  go('usuarios');
}
function editarUsuario(i){
  const u=DB.usuarios[i];
  const jefes=DB.usuarios.filter((x,xi)=>xi!==i&&['Jefatura de Recuperación','Gerencia de Recuperación','Director de Unidad de Negocio'].includes(x.rol)&&x.estatus==='Activo').map(x=>x.n);
  const marcasDisp=CATALOGOS.MARCAS_CREDITO||[];
  const regionesDisp=CATALOGOS.REGIONES||[];
  modal(`<h3>✏ Editar — ${esc(u.n)}</h3>
    <div class="msub">Todo cambio se registra con valor anterior y posterior en bitácora inmutable.</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
      <div class="field"><label for="uR2">Perfil de acceso</label>
        <select id="uR2">${Object.values(ROLES).map(r=>`<option ${r.label===u.rol?'selected':''}>${r.label}</option>`).join('')}</select></div>
      <div class="field"><label for="uJefe2">Reporta a (jefe directo)</label>
        <select id="uJefe2"><option value="">— Sin jerarquía —</option>
          ${jefes.map(j=>`<option ${u.reportaA===j?'selected':''}>${j}</option>`).join('')}
        </select></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
      <div class="field"><label for="uP2">País / Unidad de Negocio</label>
        <select id="uP2">${(CATALOGOS.PAISES_ACTIVOS||[]).map(pz=>`<option ${(u.pais||'')===pz?'selected':''}>${pz}</option>`).join('')}<option ${(u.pais||'')==='Global'?'selected':''}>Global</option></select></div>
      <div class="field"><label for="uMFA2">MFA</label>
        <select id="uMFA2"><option value="true" ${u.mfa?'selected':''}>✅ Activado</option><option value="false" ${!u.mfa?'selected':''}>⚠️ Desactivado</option></select></div>
    </div>

    <fieldset class="field"><legend>Marcas que gestiona</legend>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${marcasDisp.map(m=>`<label style="display:flex;align-items:center;gap:6px;font-size:12px;
          padding:4px 10px;border:1.5px solid var(--line);border-radius:20px;cursor:pointer">
          <input type="checkbox" name="uMarca2" value="${m}" ${(u.marcas||[]).includes(m)?'checked':''} style="accent-color:var(--turq)"> ${m}
        </label>`).join('')}
      </div>
    </fieldset>
    <fieldset class="field"><legend>Regiones que gestiona</legend>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
        ${regionesDisp.map(r=>`<label style="display:flex;align-items:center;gap:6px;font-size:12px;
          padding:4px 10px;border:1.5px solid var(--line);border-radius:20px;cursor:pointer">
          <input type="checkbox" name="uRegion2" value="${r}" ${(u.regiones||[]).includes(r)?'checked':''} style="accent-color:var(--turq)"> ${r}
        </label>`).join('')}
      </div>
    </fieldset>

    ${u.estatus==='Activo'?`<div class="field">
      <label>Cambiar contraseña <span style="font-size:10px;color:var(--text3)">— déjalo vacío para no cambiarla</span></label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 12px;margin-top:4px">
        <div style="position:relative">
          <input type="password" id="uPassNew" placeholder="Nueva contraseña (opcional)"
            style="padding-right:36px">
          <button onclick="const f=document.getElementById('uPassNew');f.type=f.type==='password'?'text':'password'"
            style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:13px;color:var(--text3)">👁</button>
        </div>
        <div>
          <input type="password" id="uPassNew2" placeholder="Confirmar nueva contraseña">
        </div>
      </div>
      <div style="font-size:10.5px;color:var(--text3);margin-top:4px">
        Si ingresas contraseña nueva: mín. 10 caracteres, mayúsculas, números y símbolo.
        El usuario deberá ingresarla en su próximo acceso.
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
      <div class="field"><label for="uFC">Forzar cambio de contraseña (sin nueva)</label>
        <select id="uFC"><option value="no">No</option><option value="si">Sí — forzar en próximo ingreso</option></select></div>
    </div>`:''}
    <div class="field"><label>Motivo del cambio <span style="font-size:10px;color:var(--text3)">(ticket o autorización)</span></label>
      <textarea id="uM2" placeholder="Ej. Ampliación de cobertura a región Bajío. Autorizado por Laura Méndez. Ticket RH-4490."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="aplicarUsuario(${i})">Guardar cambios</button></div>`);
}
function aplicarUsuario(i){
  const u=DB.usuarios[i]; const v=id=>(document.getElementById(id)||{}).value||'';
  if(!v('uM2').trim()){toast('El motivo del cambio es obligatorio.','bad');return;}
  const antes=`Perfil: ${u.rol} | País: ${u.pais||'—'} | Reporta: ${u.reportaA||'N/A'} | MFA: ${u.mfa?'Sí':'No'} | Marcas: ${(u.marcas||[]).join(',')||'—'} | Regiones: ${(u.regiones||[]).join(',')||'—'}`;
  const nuevasMarcas=[...document.querySelectorAll('input[name="uMarca2"]:checked')].map(c=>c.value);
  const nuevasRegiones=[...document.querySelectorAll('input[name="uRegion2"]:checked')].map(c=>c.value);
  u.rol=v('uR2'); u.pais=v('uP2'); u.unidadNegocio=v('uP2');
  u.reportaA=v('uJefe2')||null; u.mfa=v('uMFA2')==='true';
  u.marcas=nuevasMarcas; u.regiones=nuevasRegiones;
  // Procesar cambio de contraseña si se ingresó
  const passNew=(document.getElementById('uPassNew')||{}).value||'';
  const passNew2=(document.getElementById('uPassNew2')||{}).value||'';
  if(passNew){
    if(passNew.length<10||!/[A-Z]/.test(passNew)||!/[0-9]/.test(passNew)||!/[^A-Za-z0-9]/.test(passNew)){
      toast('La contraseña nueva no cumple la política de seguridad (mín. 10 chars, mayúsc., número, símbolo).','bad');return;
    }
    if(passNew!==passNew2){toast('Las contraseñas no coinciden.','bad');return;}
    const mv={'01':'ene','02':'feb','03':'mar','04':'abr','05':'may','06':'jun','07':'jul','08':'ago','09':'sep','10':'oct','11':'nov','12':'dic'};
    const vf=new Date(HOY); vf.setDate(vf.getDate()+90);
    u.passVence=`${String(vf.getDate()).padStart(2,'0')}-${mv[String(vf.getMonth()+1).padStart(2,'0')]}-${String(vf.getFullYear()).slice(2)}`;
  }
  if(v('uFC')==='si') u.passVence='FORZAR_CAMBIO';
  const despues=`Perfil: ${u.rol} | País: ${u.pais} | Reporta: ${u.reportaA||'N/A'} | MFA: ${u.mfa?'Sí':'No'} | Marcas: ${u.marcas.join(',')||'—'} | Regiones: ${u.regiones.join(',')||'—'}`;
  log('Modificación de usuario',esc(u.n),v('uM2'),antes,despues);
  closeModal(); toast('Cambios aplicados y registrados en bitácora.','ok'); go('usuarios');
}
function toggleUsuario(i){
  const u=DB.usuarios[i];
  if(u.estatus==='Activo'){
    modal(`<h3>🔒 Bloquear — ${esc(u.n)}</h3>
      <div class="note bad">Al bloquear se cierran todas las sesiones activas. El usuario no podrá acceder hasta ser reactivado.</div>
      <div class="field"><label for="tM">Motivo del bloqueo</label>
        <textarea id="tM" placeholder="Ej. Baja temporal por licencia médica. Ticket RH-XXXX."></textarea></div>
      <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
        <button class="act r" onclick="
          const m=(document.getElementById('tM')||{}).value||'';
          if(!m.trim()){toast('El motivo es obligatorio.','bad');return;}
          DB.usuarios[${i}].estatus='Bloqueado';
          DB.usuarios[${i}].sesionesActivas=0;
          log('Bloqueo de usuario',esc(DB.usuarios[${i}].n),m,'Activo','Bloqueado');
          closeModal();toast('${esc(u.n)} bloqueado. Registrado en bitácora.','bad');go('usuarios');">
          Confirmar bloqueo
        </button></div>`);
  } else {
    modal(`<h3>🔓 Reactivar — ${esc(u.n)}</h3>
      <div class="note">El usuario recuperará acceso inmediatamente. Se recomienda forzar cambio de contraseña al reactivar.</div>
      <div class="field"><label for="tM">Motivo de la reactivación</label>
        <textarea id="tM" placeholder="Ej. Alta de vuelta tras licencia médica. Ticket RH-XXXX."></textarea></div>
      <div class="field"><label for="tFC">Forzar cambio de contraseña</label>
        <select id="tFC"><option value="si">Sí — recomendado</option><option value="no">No</option></select></div>
      <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
        <button class="act" onclick="
          const m=(document.getElementById('tM')||{}).value||'';
          if(!m.trim()){toast('El motivo es obligatorio.','bad');return;}
          DB.usuarios[${i}].estatus='Activo';
          DB.usuarios[${i}].intentosFallidos=0;
          if((document.getElementById('tFC')||{}).value==='si') DB.usuarios[${i}].passVence='FORZAR_CAMBIO';
          log('Reactivación de usuario',esc(DB.usuarios[${i}].n),m,'Bloqueado','Activo');
          closeModal();toast('${esc(u.n)} reactivado. Registrado en bitácora.','ok');go('usuarios');">
          Confirmar reactivación
        </button></div>`);
  }
}
function eliminarUsuario(i){
  const u=DB.usuarios[i];
  modal(`<h3>🗑 Eliminar usuario — ${esc(u.n)}</h3>
    <div class="note bad" style="margin-bottom:14px">
      <b>Acción irreversible.</b> Al eliminar:<br>
      • Se cierran todas las sesiones activas inmediatamente.<br>
      • El usuario no podrá acceder al sistema.<br>
      • El registro quedará en bitácora para auditoría.<br>
      • Los registros históricos (gestiones, pagos) se conservan por trazabilidad.
    </div>
    <div class="field"><label for="tipoBaja">Tipo de baja</label>
      <select id="tipoBaja">
        <option value="Baja definitiva">Baja definitiva — fin de relación laboral</option>
        <option value="Baja temporal">Baja temporal — reincorporación prevista</option>
        <option value="Transferencia">Transferencia — se crea nuevo usuario en otro país</option>
      </select></div>
    <div class="field"><label>Motivo y evidencia <span style="font-size:10px;color:var(--text3)">(ticket RH obligatorio)</span></label>
      <textarea id="elimMot" placeholder="Ej. Baja por término de contrato. Ticket RH-4512. Autorizado por Dirección de RH el 01-sep-2026."></textarea></div>
    <div class="field"><label for="elimConfirm">Confirma escribiendo el nombre del usuario:</label>
      <input id="elimConfirm" placeholder="${esc(u.n)}"></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act r" onclick="
        const m=(document.getElementById('elimMot')||{}).value||'';
        const conf=(document.getElementById('elimConfirm')||{}).value||'';
        const tipo=(document.getElementById('tipoBaja')||{}).value||'';
        if(!m.trim()){toast('El motivo es obligatorio.','bad');return;}
        if(conf.trim()!=='${esc(u.n)}'){toast('El nombre no coincide. Escríbelo exactamente.','bad');return;}
        const eliminado=DB.usuarios.splice(${i},1)[0];
        log('Baja de usuario',esc(eliminado.n)+' · '+tipo,m,'Activo','Eliminado');
        closeModal();toast('Usuario eliminado. Registro en bitácora generado.','ok');go('usuarios');">
        Confirmar eliminación
      </button></div>`);
}
function cerrarSesion(i){
  const u=DB.usuarios[i];
  modal(`<h3>⏏ Cerrar sesiones — ${esc(u.n)}</h3>
    <div class="note warn">Se terminarán todas las sesiones activas de este usuario. Deberá iniciar sesión nuevamente.</div>
    <div class="field"><label for="csM">Motivo</label>
      <textarea id="csM" placeholder="Ej. Cierre preventivo solicitado por el propio usuario. Ticket SEG-XXXX."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act r" onclick="
        const m=(document.getElementById('csM')||{}).value||'';
        if(!m.trim()){toast('El motivo es obligatorio.','bad');return;}
        DB.usuarios[${i}].sesionesActivas=0;
        log('Cierre de sesión forzado',esc(DB.usuarios[${i}].n),m,'${u.sesionesActivas||1} sesión activa','0 sesiones');
        closeModal();toast('Sesiones cerradas para ${esc(u.n)}.','ok');go('usuarios');">
        Cerrar sesiones
      </button></div>`);
}

VIEWS.matriz=()=>{
  const mods=[
    {k:'Cartera y gestiones', d:'Cuentas, clientes, pagos, gestiones de campo'},
    {k:'Autorizaciones',       d:'Validar y rechazar gestiones del ejecutivo'},
    {k:'Asignación',           d:'Distribuir cuentas entre ejecutivos'},
    {k:'FALCO',                d:'Reportar y gestionar faltantes de caja'},
    {k:'Dictaminación',        d:'Proponer y aprobar cierre de cuentas'},
    {k:'Tableros',             d:'Ver indicadores, KPIs y rankings'},
    {k:'Reportes',             d:'Exportar y consultar información analítica'},
    {k:'Usuarios',             d:'Alta, baja, perfiles y contraseñas'},
    {k:'Configuración',        d:'Parámetros, catálogos y calendario'},
  ];
  const PERM={
    'Director de Unidad de Negocio':            ['L','—','—','L','L','L','L','—','—'],
    'Ejecutivo de Recuperación':                ['E','—','—','L','P','—','—','—','—'],
    'Jefatura de Recuperación':                 ['L','E','E','E','A','E','L','—','—'],
    'Gerencia de Recuperación':                 ['L','A','L','L','A','E','E','—','—'],
    'Jefatura Comercial':                       ['L','—','—','C','—','—','—','—','—'],
    'Dirección General':                        ['L','L','L','L','L','L','L','L','L'],
    'Administrador de Seguridad':               ['—','—','—','—','—','—','—','E','—'],
    'Administrador de Configuración':           ['—','—','—','—','—','—','—','—','E'],
    'Especialista de Información y Control':    ['L','—','—','L','—','L','E','—','—'],
  };
  const NIVEL={
    'E':{label:'Edición completa', color:'var(--green)',   bg:'rgba(30,142,90,.1)',   icon:'●', desc:'Crea, modifica y elimina'},
    'L':{label:'Solo lectura',     color:'var(--amber)',   bg:'rgba(224,138,30,.1)',  icon:'◐', desc:'Solo consulta, sin cambios'},
    'A':{label:'Autoriza',         color:'var(--indigo)',  bg:'rgba(53,50,102,.1)',   icon:'▲', desc:'Aprueba o rechaza, no crea'},
    'C':{label:'Solo captura',     color:'var(--turq)',    bg:'rgba(25,156,154,.1)',  icon:'✚', desc:'Registra, sin consulta de otros'},
    'P':{label:'Solo propio',      color:'var(--turq)',    bg:'rgba(25,156,154,.1)',  icon:'◉', desc:'Solo su propia cartera asignada'},
    '—':{label:'Sin acceso',       color:'var(--line)',    bg:'transparent',          icon:'—', desc:'Bloqueado en capa de datos'},
  };

  return head('Matriz de Permisos','Administración de Seguridad · gobierno de accesos',
    'Mapa de qué puede hacer cada perfil sobre cada módulo del sistema. El control se aplica en la capa de datos — ocultar un botón no es un control de acceso real.')

  + `<div class="panel" style="margin-bottom:14px">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <h3 style="margin:0">Perfiles × módulos</h3>
        <span class="pill n" style="font-size:10px">${Object.keys(PERM).length} perfiles · ${mods.length} módulos</span>
      </div>
      <!-- Tabla -->
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;min-width:900px">
          <thead>
            <tr style="border-bottom:2px solid var(--line)">
              <th style="text-align:left;padding:10px 12px;font-size:11px;color:var(--text3);font-weight:700;
                         text-transform:uppercase;letter-spacing:.5px;min-width:200px">Perfil</th>
              ${mods.map(m=>`<th style="text-align:center;padding:8px 6px;font-size:10px;color:var(--text3);
                    font-weight:700;text-transform:uppercase;letter-spacing:.3px;min-width:80px">
                <div>${m.k}</div>
                <div style="font-size:9px;font-weight:400;color:var(--text3);opacity:.7;margin-top:2px;
                     line-height:1.2;white-space:normal">${m.d}</div>
              </th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${Object.entries(PERM).map(([rol,vals],ri)=>`
              <tr style="border-bottom:1px solid var(--line2);${ri%2===0?'background:var(--bg)':''}">
                <td style="padding:10px 12px;font-size:12px;font-weight:700;color:var(--indigo)">${rol}</td>
                ${vals.map((v,vi)=>{
                  const n=NIVEL[v]||NIVEL['—'];
                  return `<td style="text-align:center;padding:8px 4px">
                    <div title="${n.desc}"
                      style="display:inline-flex;align-items:center;justify-content:center;
                             width:32px;height:32px;border-radius:8px;
                             background:${n.bg};
                             font-size:15px;color:${n.color};font-weight:800;
                             cursor:default;margin:auto">${n.icon}</div>
                  </td>`;}).join('')}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`

  /* Leyenda detallada */
  + `<div class="panel" style="margin-bottom:14px">
      <h3 style="margin-bottom:12px">Niveles de acceso</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
        ${Object.entries(NIVEL).filter(([k])=>k!=='P').concat([['P',NIVEL.P]]).map(([k,n])=>`
          <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;
               border-radius:10px;border:1px solid var(--line);background:${n.bg}">
            <div style="width:32px;height:32px;border-radius:8px;background:${n.bg};border:2px solid ${n.color};
                 display:flex;align-items:center;justify-content:center;font-size:16px;
                 color:${n.color};font-weight:800;flex-shrink:0">${n.icon}</div>
            <div>
              <div style="font-size:12px;font-weight:700;color:${n.color}">${n.label}</div>
              <div style="font-size:11px;color:var(--text3)">${n.desc}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`

  /* Principios de separación de deberes */
  + `<div class="panel">
      <h3 style="margin-bottom:14px">🔐 Principios de seguridad aplicados</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px">
        ${[
          {ic:'🚫',t:'Separación de deberes',d:'Ningún perfil concentra operación y su propia administración. Quien gestiona cartera no cambia parámetros; quien autoriza no registra la gestión que autoriza.'},
          {ic:'👁',t:'Mínimo privilegio',d:'Cada perfil accede únicamente a lo que su función requiere. El acceso adicional requiere autorización explícita de Dirección General.'},
          {ic:'📋',t:'Bitácora inmutable',d:'Todo cambio de permiso, bloqueo o alta de usuario queda registrado con actor, motivo, valor anterior y posterior. No se puede modificar.'},
          {ic:'🔑',t:'Autenticación MFA',d:'MFA es una recomendación visible en cada usuario (insignia "Sin MFA"), especialmente para perfiles con acceso a datos sensibles. No es obligatoria ni bloquea el acceso, y su ausencia ya no genera una alerta de seguridad.'},
          {ic:'⏰',t:'Vencimiento de credenciales',d:'Las contraseñas vencen cada 90 días. Las cuentas inactivas por más de 30 días se bloquean automáticamente.'},
          {ic:'🌐',t:'Control por IP',d:'Los accesos desde IPs no registradas generan alerta. Los ejecutivos de campo operan desde IPs móviles monitoreadas por rango.'},
        ].map(p=>`
          <div style="padding:12px 14px;border-radius:10px;border:1px solid var(--line);background:var(--surface)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:18px">${p.ic}</span>
              <span style="font-size:12px;font-weight:700;color:var(--indigo)">${p.t}</span>
            </div>
            <div style="font-size:11.5px;color:var(--text2);line-height:1.5">${p.d}</div>
          </div>`).join('')}
      </div>
    </div>`;
};

VIEWS.bitacoraSeg=()=>bitacoraVista('Bitácora de Seguridad','Administración de Seguridad · auditoría',
  ['Alta de usuario','Modificación de usuario','Bloqueo de usuario','Reactivación de usuario','Cierre de sesión forzado'],
  'bitacoraSeg');
VIEWS.bitacoraCfg=()=>bitacoraVista('Bitácora de Configuración','Administración de Configuración · auditoría',
  ['Cambio de parámetro','Reversión de parámetro','Modificación de catálogo','Override de catorcena','Apertura de catorcena','Cierre de catorcena'],
  'bitacoraCfg');

const ICON_ACCION={
  'Cambio de parámetro':    {ic:'⚙️',cls:'m'},
  'Reversión de parámetro': {ic:'↩️',cls:'a'},
  'Modificación de catálogo':{ic:'📚',cls:'b'},
  'Eliminación de catálogo': {ic:'🗑️',cls:'a'},
  'Alerta de seguridad':     {ic:'🚨',cls:'a'},
  'Reseteo de intentos fallidos':{ic:'↺',cls:'m'},
  'Override de catorcena':   {ic:'📅',cls:'v'},
  'Apertura de catorcena':   {ic:'▶️',cls:'g'},
  'Cierre de catorcena':     {ic:'⏹️',cls:'n'},
  'Alta de usuario':         {ic:'👤',cls:'g'},
  'Modificación de usuario': {ic:'✏️',cls:'m'},
  'Bloqueo de usuario':      {ic:'🔒',cls:'a'},
  'Reactivación de usuario': {ic:'🔓',cls:'g'},
  'Cierre de sesión forzado':{ic:'⚠️',cls:'a'},
};

function bitacoraVista(titulo,subtit,filtro,vistaKey){
  if(typeof window.bitBusq==='undefined') window.bitBusq='';
  if(typeof window.bitFAccion==='undefined') window.bitFAccion='';
  const busqB=(window.bitBusq||'').toLowerCase().trim();
  const fAcc=window.bitFAccion||'';
  const nav=()=>go(vistaKey||'bitacoras');

  let regs=filtro?DB.bitacora.filter(b=>filtro.includes(b.accion)):DB.bitacora;
  const total=regs.length;
  if(fAcc) regs=regs.filter(b=>b.accion===fAcc);
  if(busqB) regs=regs.filter(b=>
    b.quien.toLowerCase().includes(busqB)||
    b.accion.toLowerCase().includes(busqB)||
    b.detalle.toLowerCase().includes(busqB)||
    b.motivo.toLowerCase().includes(busqB));

  const tiposAcc=[...new Set((filtro||DB.bitacora.map(b=>b.accion)).filter(Boolean))];
  const hasFilt=fAcc||busqB;
  const actores=[...new Set(DB.bitacora.filter(b=>!filtro||filtro.includes(b.accion)).map(b=>b.quien))].length;

  return head(titulo,subtit,
    'Registro inmutable de acciones con efecto sobre el sistema. Cada entrada conserva quién actuó, qué cambió, cuándo, con qué motivo y los valores antes y después.')

  + kpi([
      {n:total,       l:'Registros en bitácora'},
      {n:regs.length, l:hasFilt?'Resultados del filtro':'Mostrando todos', cls:hasFilt?'m':'up'},
      {n:actores,     l:'Actores distintos'},
      {n:tiposAcc.length, l:'Tipos de acción'},
    ])

  + `<div class="filters" style="margin-bottom:16px;flex-wrap:wrap">
      <input type="search" placeholder="Buscar por actor, acción, detalle o motivo…"
        style="flex:1;min-width:220px" value="${esc(window.bitBusq||'')}"
        oninput="window.bitBusq=this.value;window.bitPage=0;go('${vistaKey||'bitacoras'}')">
      <select style="padding:8px 10px;border:1.5px solid var(--line);border-radius:9px;font-size:12px;background:var(--surface)"
        onchange="window.bitFAccion=this.value;window.bitPage=0;go('${vistaKey||'bitacoras'}')">
        <option value="">Todos los tipos de acción</option>
        ${tiposAcc.map(a=>`<option value="${esc(a)}" ${fAcc===a?'selected':''}>${esc(a)}</option>`).join('')}
      </select>
      <button class="act o sm" ${hasFilt?'':'style="opacity:.4;cursor:default"'}
        onclick="${hasFilt?`window.bitBusq='';window.bitFAccion='';go('${vistaKey||'bitacoras'}')`:''}">✕ Limpiar</button>
    </div>`

  + (()=>{
    if(typeof window.bitPage==='undefined') window.bitPage=0;
    const PER_PAGE=30;
    const totalRegs=regs.length;
    const totalPags=Math.ceil(totalRegs/PER_PAGE);
    if(window.bitPage>=totalPags) window.bitPage=Math.max(0,totalPags-1);
    const pagRegs=regs.slice(window.bitPage*PER_PAGE,(window.bitPage+1)*PER_PAGE);
    const vistaKey2=vistaKey||'bitacoras';
    return (regs.length===0
    ? `<div class="empty">${hasFilt?'Sin registros que coincidan con los filtros aplicados.':'Sin movimientos registrados aún. Realiza una acción y regresa a esta vista.'}</div>`
    : `<div style="display:flex;flex-direction:column;gap:8px">
        ${pagRegs.map(b=>{
          const meta=ICON_ACCION[b.accion]||{ic:'•',cls:'n'};
          return `<div style="background:var(--surface);border:1px solid var(--line);border-radius:12px;
                       padding:14px 18px;display:grid;
                       grid-template-columns:84px 1fr 148px;gap:14px;align-items:start">
            <div style="display:flex;flex-direction:column;align-items:center;gap:5px;padding-top:2px">
              <div style="font-size:24px;line-height:1">${meta.ic}</div>
              <span class="pill ${meta.cls}" style="font-size:9px;text-align:center;line-height:1.4;white-space:normal;max-width:80px;padding:3px 7px">${esc(b.accion)}</span>
            </div>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--indigo);margin-bottom:4px">${esc(b.detalle)}</div>
              <div style="font-size:11.5px;color:var(--text2);margin-bottom:8px;line-height:1.5">
                <span style="color:var(--text3)">Motivo:</span> ${esc(b.motivo)}
              </div>
              ${(b.antes||b.despues)?`<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                ${b.antes?`<span style="font-size:11px;color:var(--text3);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:2px 9px">
                  Antes: <b>${esc(b.antes)}</b></span>`:''}
                ${b.antes&&b.despues?`<span style="color:var(--text3)">→</span>`:''}
                ${b.despues?`<span style="font-size:11px;color:var(--turq);background:rgba(25,156,154,.08);border:1px solid rgba(25,156,154,.3);border-radius:6px;padding:2px 9px;font-weight:600">
                  Después: <b>${esc(b.despues)}</b></span>`:''}
              </div>`:''}
            </div>
            <div style="text-align:right">
              <div style="font-size:12px;font-weight:700;color:var(--indigo)">${esc(b.quien)}</div>
              <div style="font-size:10.5px;color:var(--text3);margin-top:2px">${esc(b.rol)}</div>
              <div style="font-size:10.5px;color:var(--text3);margin-top:6px;font-family:monospace;letter-spacing:-.3px">${b.ts}</div>
            </div>
          </div>`;}).join('')}
      </div>
      </div>`
    ) + (totalPags>1?`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;flex-wrap:wrap;gap:10px">
        <div style="font-size:11.5px;color:var(--text3)">
          Mostrando ${window.bitPage*PER_PAGE+1}–${Math.min((window.bitPage+1)*PER_PAGE,totalRegs)} de ${totalRegs} registros
          ${hasFilt?` (filtrados de ${total} totales)`:''}
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="act o sm" ${window.bitPage===0?'disabled style="opacity:.4"':''}
            onclick="window.bitPage=0;go('${vistaKey2}')">«</button>
          <button class="act o sm" ${window.bitPage===0?'disabled style="opacity:.4"':''}
            onclick="window.bitPage=Math.max(0,window.bitPage-1);go('${vistaKey2}')">‹ Anterior</button>
          ${Array.from({length:totalPags},(_, i)=>
            `<button class="act ${i===window.bitPage?'':'o'} sm" style="min-width:32px"
              onclick="window.bitPage=${i};go('${vistaKey2}')">${i+1}</button>`).join('')}
          <button class="act o sm" ${window.bitPage===totalPags-1?'disabled style="opacity:.4"':''}
            onclick="window.bitPage=Math.min(totalPags-1,window.bitPage+1);go('${vistaKey2}')">Siguiente ›</button>
          <button class="act o sm" ${window.bitPage===totalPags-1?'disabled style="opacity:.4"':''}
            onclick="window.bitPage=totalPags-1;go('${vistaKey2}')">»</button>
        </div>
        <div style="font-size:11px;color:var(--text3)">La bitácora es inmutable</div>
      </div>`:'<div style="font-size:11px;color:var(--text3);text-align:right;margin-top:10px">'+totalRegs+' registros · La bitácora es inmutable</div>');
  })()
  ;
}

/* ══════════════════════════════════════════════════════════════════
   14. VISTAS · ADMINISTRACIÓN DE CONFIGURACIÓN
   ══════════════════════════════════════════════════════════════════ */
VIEWS.parametros=()=>{
  // Agrupar PARAMS por grupo
  const grupos=[...new Set(PARAMS.map(p=>p.g))];
  const contCrit=PARAMS.filter(p=>p.crit).length;
  const contMod=PARAMS.filter(p=>p.prev!=null).length;

  return head('Parámetros del Sistema','Administración de Configuración',
    'Valores que controlan el comportamiento del sistema en todos los países. Los parámetros críticos afectan reglas de escalamiento, metas y umbrales de desempeño. Todo cambio requiere motivo y queda en bitácora.')

  + kpi([
      {n:PARAMS.length,        l:'Parámetros configurables'},
      {n:contCrit,             l:'Parámetros críticos',cls:contCrit?'down':'up',d:'Afectan reglas históricas'},
      {n:contMod,              l:'Modificados (con reversión disponible)',cls:contMod?'m':'up'},
      {n:grupos.length,        l:'Grupos de configuración'}
    ])

  + grupos.map(g=>{
      const paramsG=PARAMS.map((p,i)=>({...p,i})).filter(p=>p.g===g);
      return `<div class="panel" style="margin-bottom:14px">
        <h3 style="font-size:14px;font-weight:800;color:var(--indigo);margin-bottom:16px">
          ${g}
        </h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:2px solid var(--line)">
              <th style="font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:6px 10px;text-align:left">Parámetro</th>
              <th style="font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:6px 10px;text-align:center;width:120px">Valor actual</th>
              <th style="font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:6px 10px;text-align:left">Descripción</th>
              <th style="font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:6px 10px;text-align:center;width:80px">Anterior</th>
              <th style="font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:6px 10px;text-align:center;width:130px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${paramsG.map(p=>`
              <tr style="border-bottom:1px solid var(--line2);${p.prev!=null?'background:rgba(224,138,30,.04)':''}">
                <td style="padding:10px 10px;vertical-align:top">
                  <div style="font-size:12px;font-weight:700;color:var(--indigo);font-family:monospace">${p.k}</div>
                  <div style="display:flex;gap:6px;margin-top:4px">
                    ${p.crit?'<span class="pill a" style="font-size:9px">CRÍTICO</span>':''}
                    <span class="pill n" style="font-size:9px">${p.t}</span>
                    ${p.min!=null?`<span style="font-size:9px;color:var(--text3)">min:${p.min} max:${p.max}</span>`:''}
                  </div>
                </td>
                <td style="padding:10px;text-align:center;vertical-align:top">
                  <div style="font-size:16px;font-weight:900;color:${p.prev!=null?'var(--amber)':'var(--indigo)'}">
                    ${typeof p.v==='boolean'?(p.v?'✓ Activo':'✗ Inactivo'):p.t==='lista'?(p.v+(MONEDA_INFO[p.v]?' ('+MONEDA_INFO[p.v].nombre+')':'')):p.v}${p.t==='porcentaje'?'%':''}
                  </div>
                </td>
                <td style="padding:10px;font-size:12px;color:var(--text2);vertical-align:top;line-height:1.5">${p.d}</td>
                <td style="padding:10px;text-align:center;vertical-align:top;font-size:11px;color:var(--text3)">
                  ${p.prev!=null?`<span style="color:var(--amber);font-weight:600">${p.prev}${p.t==='porcentaje'?'%':''}</span>`:'—'}
                </td>
                <td style="padding:10px;text-align:center;vertical-align:top">
                  <div class="btnrow" style="justify-content:center">
                    <button class="act sm o" onclick="editarParam(${p.i})">Editar</button>
                    <button class="act sm ${p.prev==null?'':'r'}" ${p.prev==null?'disabled style="opacity:.4"':''} onclick="revertirParam(${p.i})">Revertir</button>
                  </div>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
    }).join('')

  + `<div class="note warn">Los parámetros <b>CRÍTICOS</b> rigen reglas aplicadas en catorcenas cerradas. Modificarlos no recalcula el pasado; los cierres históricos conservan los valores vigentes al momento del cierre.</div>`;
};
function editarParam(i){
  const p=PARAMS[i];
  modal(`<h3>${p.k}</h3><div class="msub">${p.d}</div>
    ${p.crit?'<div class="note bad">Parámetro crítico. El cambio impacta reglas de escalamiento, metas o topes operativos.</div>':''}
    <div class="field"><label for="pV">Valor</label>
      ${p.t==='booleano'
        ? `<select id="pV"><option value="true" ${p.v?'selected':''}>Activado</option><option value="false" ${!p.v?'selected':''}>Desactivado</option></select>`
        : p.t==='lista'
        ? `<select id="pV">${(p.opciones||[]).map(o=>`<option value="${o}" ${p.v===o?'selected':''}>${o}${MONEDA_INFO[o]?' — '+MONEDA_INFO[o].nombre:''}</option>`).join('')}</select>`
        : `<input type="number" step="${p.t==='porcentaje'?'0.1':'1'}" id="pV" value="${p.v}" min="${p.min}" max="${p.max}">`}
      ${p.min!=null?`<div style="font-size:10.5px;color:var(--text3);margin-top:4px">Rango permitido: ${p.min} – ${p.max}</div>`:''}
    </div>
    <div class="field"><label for="pM">Motivo del cambio</label><textarea id="pM" placeholder="Ej. Ajuste por resolución de la dirección regional del 18-ago-2026."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="guardarParam(${i})">Guardar cambio</button></div>`);
}
function guardarParam(i){
  const p=PARAMS[i]; const raw=(document.getElementById('pV')||{}).value; const mot=(document.getElementById('pM')||{}).value||'';
  if(!mot.trim()){toast('El motivo es obligatorio para cambiar un parámetro.','bad');return;}
  let nuevo;
  if(p.t==='booleano')      nuevo = raw==='true';
  else if(p.t==='lista')    nuevo = raw;
  else                      nuevo = Number(raw);
  /* Validación genérica de rango — aplica a todo parámetro numérico/porcentaje con min/max definidos */
  if((p.t==='número'||p.t==='porcentaje')){
    if(isNaN(nuevo)){toast('Captura un valor numérico válido.','bad');return;}
    if(p.min!=null && (nuevo<p.min||nuevo>p.max)){
      toast(`${p.k} debe estar entre ${p.min} y ${p.max}.`,'bad');return;
    }
  }
  if(p.t==='lista' && (p.opciones||[]).length && !p.opciones.includes(nuevo)){
    toast('Selecciona una opción válida.','bad');return;
  }
  p.prev=p.v; p.v=nuevo;
  if(p.k==='DURACION_CATORCENA'){ inicializarCalendario(); }
  log('Cambio de parámetro',p.k,mot,String(p.prev),String(p.v));
  closeModal(); toast(`${p.k} actualizado. Toda la aplicación usa el nuevo valor.`,'ok'); go('parametros');
}
function revertirParam(i){
  const p=PARAMS[i]; if(p.prev==null)return;
  const antes=p.v; p.v=p.prev; p.prev=null;
  if(p.k==='DURACION_CATORCENA'){ inicializarCalendario(); }
  log('Reversión de parámetro',p.k,'Rollback solicitado por el administrador',String(antes),String(p.v));
  toast(`${p.k} revertido a ${p.v}.`,'ok'); go('parametros');
}

VIEWS.catalogos=()=>{
  if(typeof window.catBusqCatalogo==='undefined') window.catBusqCatalogo='';
  const busqC=(window.catBusqCatalogo||'').toLowerCase().trim();

  const META_CAT={
    TIPO_GESTION:        {desc:'Tipos de gestión que puede registrar el ejecutivo en campo',        editable:true,  critico:false},
    ESTATUS_CUENTA:      {desc:'Estados posibles de una cuenta en el ciclo de recuperación',        editable:false, critico:true},
    MOTIVO_FALCO:        {desc:'Causas por las que el área comercial puede reportar un FALCO',      editable:true,  critico:false},
    MOTIVO_DICTAMINACION:{desc:'Categorías de cierre de cuenta en el proceso de dictaminación',     editable:false, critico:true},
    DESC_DICTAMINACION:  {desc:'Descripciones de los motivos de dictaminación (no es lista)',       editable:false, critico:true},
    CATEGORIA_LIDER:     {desc:'Clasificación de riesgo del líder de grupo solidario',              editable:true,  critico:false},
    MOTIVO_NO_PAGO:      {desc:'Motivo de no pago o causa de mora que el ejecutivo captura al gestionar la cuenta en campo', editable:true,  critico:false},
    ETAPAS:              {desc:'Etapas del ciclo de vida de una cuenta en mora',                    editable:false, critico:true},
    PAISES_ACTIVOS:      {desc:'País que opera esta instancia del sistema (una instancia = un país, igual que la moneda)',      editable:false,  critico:true},
    MARCAS_CREDITO:      {desc:'Marcas de producto crediticio disponibles en el sistema',           editable:true,  critico:false},
    REGIONES:            {desc:'Regiones geográficas de operación (para filtros y asignación)',     editable:true,  critico:false},
    MOTIVO_RECHAZO_DICT: {desc:'Causas por las que la jefatura puede rechazar una dictaminación',   editable:true,  critico:false},
    DOCUMENTOS_DICT:     {desc:'Tipos de documentos válidos para soportar una dictaminación',       editable:true,  critico:false},
  };

  const cats=Object.entries(CATALOGOS).filter(([k,v])=>Array.isArray(v)&&
    (!busqC||k.toLowerCase().includes(busqC)||(META_CAT[k]?.desc||'').toLowerCase().includes(busqC)||
     v.some(vv=>vv.toLowerCase().includes(busqC))));

  const totalVals=Object.values(CATALOGOS).filter(v=>Array.isArray(v)).reduce((a,v)=>a+v.length,0);
  const editables=Object.entries(CATALOGOS).filter(([k,v])=>Array.isArray(v)&&META_CAT[k]?.editable).length;
  const criticos=Object.entries(CATALOGOS).filter(([k,v])=>Array.isArray(v)&&META_CAT[k]?.critico).length;

  return head('Catálogos del Sistema','Administración de Configuración',
    'Listas de valores controladas que alimentan selectores, formularios y reglas de negocio en todos los perfiles. Mantenerlas cerradas evita capturas libres que impiden el análisis estadístico posterior.')

  + kpi([
      {n:cats.length+(busqC?` de ${Object.keys(CATALOGOS).filter(k=>Array.isArray(CATALOGOS[k])).length}`:Object.keys(CATALOGOS).filter(k=>Array.isArray(CATALOGOS[k])).length), l:'Catálogos'},
      {n:editables,   l:'Editables por adminCfg', cls:'up'},
      {n:criticos,    l:'Críticos (sin eliminar)', cls:'down', d:'Usados en registros históricos'},
      {n:totalVals,   l:'Valores configurados en total'}
    ])

  + `<div class="filters" style="margin-bottom:16px">
      <input type="search" placeholder="Buscar catálogo por nombre, descripción o valor…"
        style="flex:1;min-width:200px" value="${esc(window.catBusqCatalogo||'')}"
        oninput="window.catBusqCatalogo=this.value;go('catalogos')">
      <button class="act o sm" ${busqC?'':'style="opacity:.4;cursor:default"'}
        onclick="${busqC?`window.catBusqCatalogo='';go('catalogos')`:''}">✕ Limpiar</button>
    </div>`

  + (cats.length===0?`<div class="empty">No hay catálogos que coincidan con "${esc(busqC)}".</div>`:
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(440px,1fr));gap:14px">
      ${cats.map(([k,vals])=>{
        const meta=META_CAT[k]||{desc:'',editable:true,critico:false};
        return `<div class="panel" style="margin:0">
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px">
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:800;color:var(--indigo);font-family:monospace;letter-spacing:-.2px">${k}</div>
              <div style="font-size:11.5px;color:var(--text3);margin-top:3px;line-height:1.4">${meta.desc||'—'}</div>
              <div style="display:flex;gap:5px;margin-top:6px;flex-wrap:wrap">
                ${meta.critico?'<span class="pill a" style="font-size:9px">CRÍTICO</span>':''}
                ${meta.editable?'<span class="pill g" style="font-size:9px">EDITABLE</span>':'<span class="pill n" style="font-size:9px">SOLO LECTURA</span>'}
                <span class="pill n" style="font-size:9px">${vals.length} valor${vals.length!==1?'es':''}</span>
              </div>
            </div>
            ${meta.editable?`<button class="act sm o" onclick="agregarCat('${k}')">+ Añadir</button>`:''}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid var(--line);padding-top:10px">
            ${vals.map((v,i)=>`
              <span style="display:inline-flex;align-items:center;gap:4px;background:var(--bg);
                   border:1px solid var(--line);border-radius:20px;padding:4px 10px 4px 12px;
                   font-size:12px;font-weight:600;color:var(--indigo)">
                ${esc(v)}
                ${meta.editable?`<button onclick="eliminarCatalogo('${k}',${i})"
                  style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:15px;
                         padding:0 0 0 2px;line-height:1" title="Eliminar valor">×</button>`:''}
              </span>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`)

  + `<div class="note warn" style="margin-top:14px">
      Los catálogos <b>CRÍTICOS</b> están protegidos porque sus valores están referenciados en registros históricos. Agregar es seguro; eliminar puede romper la consistencia del historial.
    </div>`;
};
function eliminarCatalogo(k,i){
  const v=CATALOGOS[k]?.[i];
  if(!v) return;
  const ky=k; const ii=i;
  modal(`<h3>Eliminar valor de catálogo</h3>
    <div class="msub">Catálogo: <b>${ky.replace(/_/g,' ')}</b></div>
    <div class="note bad" style="margin:14px 0">Vas a eliminar el valor <b>"${esc(v)}"</b>. Solo es seguro si no está en uso en registros activos.</div>
    <div class="field"><label for="catElimMot">Motivo</label><textarea id="catElimMot" placeholder="Ej. Valor obsoleto, reemplazado por nuevo ítem…"></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act r" onclick="
        const mt=(document.getElementById('catElimMot')||{}).value||'';
        if(!mt.trim()){toast('El motivo es obligatorio.','bad');return;}
        const eliminado=CATALOGOS['${ky}'].splice(${ii},1)[0];
        log('Eliminación de catálogo','${ky} · baja de «'+eliminado+'»',mt,CATALOGOS['${ky}'].length+1+' valores',CATALOGOS['${ky}'].length+' valores');
        closeModal();toast('Valor eliminado del catálogo.','ok');go('catalogos');">Eliminar</button>
    </div>`);
}
function agregarCat(k){
  modal(`<h3>Agregar valor a ${k.replace(/_/g,' ')}</h3>
    <div class="field"><label for="cV">Nuevo valor</label><input id="cV" placeholder="Texto del catálogo"></div>
    <div class="field"><label for="cM">Motivo</label><input id="cM" placeholder="Ej. Nuevo supuesto operativo detectado en Colombia"></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="guardarCat('${k}')">Agregar</button></div>`);
}
function guardarCat(k){
  const v=(document.getElementById('cV')||{}).value||'', m=(document.getElementById('cM')||{}).value||'';
  if(!v.trim()||!m.trim()){toast('Valor y motivo son obligatorios.','bad');return;}
  CATALOGOS[k].push(v);
  log('Modificación de catálogo',`${k} · alta de «${v}»`,m,CATALOGOS[k].length-1+' valores',CATALOGOS[k].length+' valores');
  closeModal(); toast('Valor agregado al catálogo.','ok'); go('catalogos');
}

VIEWS.catorcenasAdm=()=>{
  const cs=DB.catorcenas;
  const cur=cs[DB.catorcenaActual-1];
  const cerradas=cs.filter(c=>c.estado==='CERRADA');
  const programadas=cs.filter(c=>c.estado==='PROGRAMADA');
  const diasTransc=Math.round((HOY-cur.inicio)/86400000)+1;
  const diasTotal=Math.round((cur.fin-cur.inicio)/86400000)+1;
  const pctAvance=Math.min(100,Math.round(diasTransc/diasTotal*100));

  // Agrupar catorcenas por trimestre
  const trim=[
    {label:'T1 · Enero – Marzo',      cats:cs.filter(c=>c.num>=1&&c.num<=7)},
    {label:'T2 · Abril – Junio',       cats:cs.filter(c=>c.num>=8&&c.num<=13)},
    {label:'T3 · Julio – Septiembre',  cats:cs.filter(c=>c.num>=14&&c.num<=19)},
    {label:'T4 · Octubre – Diciembre', cats:cs.filter(c=>c.num>=20&&c.num<=26)},
  ];

  return head('Catorcenas del Año 2026','Administración de Configuración · calendario',
    `Gestión del calendario anual de catorcenas. El sistema genera y cierra los períodos automáticamente. El override manual sólo aplica a catorcenas futuras y requiere motivo.`)

  /* ── KPIs ── */
  + kpi([
      {n:'26', l:'Catorcenas 2026', d:'Generadas automáticamente'},
      {n:`C${DB.catorcenaActual}`, l:'En curso', d:`${fecha(cur.inicio)} → ${fecha(cur.fin)}`, cls:'up'},
      {n:cerradas.length, l:'Cerradas', d:`${cs.length-cerradas.length-1} pendientes`},
      {n:cs.filter(c=>c.override).length, l:'Con override', d:'Ajuste excepcional aplicado'},
    ])

  /* ── Progreso de la catorcena activa ── */
  + `<div class="panel" style="margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-size:13px;font-weight:800;color:var(--indigo)">
            Catorcena ${DB.catorcenaActual} — En curso
          </div>
          <div style="font-size:12px;color:var(--text3);margin-top:3px">
            ${fecha(cur.inicio)} al ${fecha(cur.fin)} · ${diasTotal} días
          </div>
        </div>
        <div style="display:flex;gap:20px;align-items:center">
          <div style="text-align:center">
            <div style="font-size:22px;font-weight:900;color:var(--turq)">${diasTransc}</div>
            <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Días transcurridos</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:22px;font-weight:900;color:var(--indigo)">${diasTotal-diasTransc}</div>
            <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Días restantes</div>
          </div>
        </div>
      </div>
      <div style="background:var(--bg);border-radius:8px;height:14px;overflow:hidden;position:relative">
        <div style="height:100%;width:${pctAvance}%;background:linear-gradient(90deg,var(--turq),var(--indigo));
             border-radius:8px;transition:width .6s"></div>
        <div style="position:absolute;right:10px;top:50%;transform:translateY(-50%);
             font-size:10px;font-weight:700;color:var(--text3)">${pctAvance}%</div>
      </div>
      <div class="note" style="margin-top:10px;font-size:11px">
        <b>Regla operativa:</b> no se permite override a una catorcena en curso. El siguiente período susceptible de ajuste es la Catorcena ${DB.catorcenaActual+1} (${fecha(cs[DB.catorcenaActual].inicio)} al ${fecha(cs[DB.catorcenaActual].fin)}).
      </div>
    </div>`

  /* ── Calendario por trimestre ── */
  + trim.map(t=>`
    <div class="panel" style="margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <h3 style="margin:0;font-size:13px;font-weight:800;color:var(--indigo)">${t.label}</h3>
        <div style="display:flex;gap:8px;font-size:11px;color:var(--text3)">
          <span style="display:flex;align-items:center;gap:4px">
            <span style="width:9px;height:9px;border-radius:50%;background:var(--green);display:inline-block"></span> Cerrada
          </span>
          <span style="display:flex;align-items:center;gap:4px">
            <span style="width:9px;height:9px;border-radius:50%;background:var(--turq);display:inline-block"></span> En curso
          </span>
          <span style="display:flex;align-items:center;gap:4px">
            <span style="width:9px;height:9px;border-radius:50%;background:var(--line);display:inline-block"></span> Programada
          </span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px">
        ${t.cats.map(c=>{
          const esCur=c.estado==='ABIERTA';
          const esCerr=c.estado==='CERRADA';
          const esProg=c.estado==='PROGRAMADA';
          const border=esCur?'2px solid var(--turq)':esCerr?'1px solid var(--green)':'1px solid var(--line)';
          const bg=esCur?'rgba(25,156,154,.06)':esCerr?'rgba(30,142,90,.04)':'var(--surface)';
          const dot=esCur?'var(--turq)':esCerr?'var(--green)':'var(--line)';
          return `<div style="border:${border};border-radius:12px;padding:12px 14px;background:${bg};
                       position:relative;transition:box-shadow .15s"
                       ${esProg?'onmouseover="this.style.boxShadow=var(--sh1)" onmouseout="this.style.boxShadow=none"':''}
                       style="cursor:${esProg?'pointer':'default'}">
            ${esCur?`<div style="position:absolute;top:10px;right:12px;font-size:10px;font-weight:700;
                       color:var(--turq);background:rgba(25,156,154,.12);border-radius:20px;padding:2px 8px">EN CURSO</div>`:''}
            ${esCerr&&c.override?`<div style="position:absolute;top:10px;right:12px;font-size:10px;font-weight:700;
                       color:var(--amber);background:rgba(224,138,30,.12);border-radius:20px;padding:2px 8px">OVERRIDE</div>`:''}
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <div style="width:10px;height:10px;border-radius:50%;background:${dot};flex-shrink:0"></div>
              <div style="font-size:16px;font-weight:900;color:var(--indigo)">C${c.num}</div>
            </div>
            <div style="font-size:11.5px;color:var(--text3);margin-bottom:2px">${fecha(c.inicio)} → ${fecha(c.fin)}</div>
            <div style="font-size:11px;color:var(--text3);margin-bottom:10px">
              ${Math.round((c.fin-c.inicio)/86400000)+1} días
              ${c.override?`· <span style="color:var(--amber);font-weight:600">Override: ${esc(c.override)}</span>`:''}
            </div>
            ${esProg
              ? `<button class="act sm o" style="width:100%;justify-content:center" onclick="overrideCat(${c.num})">
                  Aplicar override
                </button>`
              : `<div style="font-size:11px;font-weight:600;color:${esCur?'var(--turq)':'var(--text3)'};
                      text-align:center;padding:5px 0;background:${esCur?'rgba(25,156,154,.08)':'var(--bg)'};
                      border-radius:8px">
                  ${esCur?'🔴 Período activo — sin cambios':'✓ Período cerrado'}
                </div>`}
          </div>`;}).join('')}
      </div>
    </div>`).join('')
  + `<div class="note warn">El override ajusta la duración de la catorcena entre 12 y 16 días. Solo aplica a períodos <b>PROGRAMADOS</b>, nunca al período en curso. Todo override queda en bitácora con motivo.</div>`;
};

function overrideCat(num){
  const c=DB.catorcenas[num-1];
  modal(`<h3>Override de la catorcena ${num}</h3>
    <div class="msub">Actual: ${fecha(c.inicio)} al ${fecha(c.fin)}</div>
    <div class="note warn">Solo para causas justificadas: días festivos oficiales, cambios legislativos o instrucción de dirección. La duración resultante debe quedar entre <b>12 y 16 días</b>.</div>
    <div class="field"><label for="oD">Nueva duración (días)</label><input type="number" id="oD" value="${Math.round((c.fin-c.inicio)/86400000)+1}" min="12" max="16"></div>
    <div class="field"><label for="oM">Motivo del override</label><textarea id="oM" placeholder="Ej. Semana Santa: se amplía a 16 días por instrucción de dirección regional."></textarea></div>
    <div class="mfoot"><button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="guardarOverride(${num})">Aplicar override</button></div>`);
}
function guardarOverride(num){
  const c=DB.catorcenas[num-1];
  const d=Number((document.getElementById('oD')||{}).value||0), m=(document.getElementById('oM')||{}).value||'';
  if(d<12||d>16){toast('La duración debe estar entre 12 y 16 días.','bad');return;}
  if(!m.trim()){toast('El motivo del override es obligatorio.','bad');return;}
  const antes=fecha(c.fin);
  const nf=new Date(c.inicio); nf.setDate(nf.getDate()+d-1); c.fin=nf; c.override=`${d} días`;
  /* ── Cascada: recalcular en cadena todas las catorcenas posteriores del mismo año ──
     Un cambio de duración desplaza la fecha de inicio de todo lo que sigue; de lo
     contrario se generan traslapes (si se alarga) o huecos (si se acorta) en el calendario. */
  let cursor=new Date(c.fin); cursor.setDate(cursor.getDate()+1);
  for(let i=num; i<DB.catorcenas.length; i++){
    const sig=DB.catorcenas[i];
    const dur=sig.override?Number(sig.override):(Math.round((sig.fin-sig.inicio)/86400000)+1);
    sig.inicio=new Date(cursor);
    const nfin=new Date(cursor); nfin.setDate(nfin.getDate()+dur-1);
    sig.fin=nfin;
    cursor=new Date(nfin); cursor.setDate(cursor.getDate()+1);
  }
  log('Override de catorcena',`Catorcena ${num} · nueva duración ${d} días`,
      m+` · Recalculadas en cascada ${DB.catorcenas.length-num} catorcena(s) posteriores.`,
      antes,fecha(c.fin));
  closeModal(); toast(`Catorcena ${num} ajustada a ${d} días. El resto del calendario se recalculó automáticamente.`,'ok'); go('catorcenasAdm');
}

/* ══════════════════════════════════════════════════════════════════
   15. HOOKS POST-RENDER E INICIALIZACIÓN
   ══════════════════════════════════════════════════════════════════ */
const AFTER={
  miCartera:()=>{
    if(filtroPendiente){
      const sel=document.getElementById('fEst');
      if(sel) sel.value=filtroPendiente;
      filtroPendiente=null;
    }
    renderTablaCartera();
  },
  planeacion:renderPoolGrupos
};
/* ═══ Estado global Gerencia / Director ═══════════════════════════════ */
window.gerView      = window.gerView      || 'ejecutiva'; // 'ejecutiva' | 'jefatura'
window.gerFiltroJef = window.gerFiltroJef || '';
window.gerFiltroEj  = window.gerFiltroEj  || '';
window.gerFiltroMarca = window.gerFiltroMarca || '';
window.gerFiltroRegion= window.gerFiltroRegion|| '';


function tieneVisitaValidada(cuentaId){
  return DB.gestiones.some(g=>g.cuentaId===cuentaId&&g.validadoPorJefatura===true);
}
function limpiarFiltrosEq(){ window.fEqQ=window.fEqMarca=window.fEqRuta=window.fEqRegion=window.fEqEst=''; go('carteraEquipo'); }
/* ═══ LOGIN ═══════════════════════════════════════════════════════════ */
function mostrarLogin(){
  const main=document.getElementById('appMain');
  const side=document.getElementById('appSide');
  const top=document.querySelector('.topbar');
  if(main) main.style.display='none';
  if(side) side.style.display='none';
  if(top)  top.style.display='none';
  let loginEl=document.getElementById('loginScreen');
  if(!loginEl){
    loginEl=document.createElement('div');
    loginEl.id='loginScreen';
    loginEl.innerHTML=`
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
           background:linear-gradient(135deg,#1E1B40 0%,#2C2957 50%,#103C3B 100%);
           padding:20px">
        <div style="background:#fff;border-radius:24px;padding:44px 40px;width:100%;max-width:420px;
             box-shadow:0 32px 80px rgba(0,0,0,.35)">
          <!-- Logo -->
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;justify-content:center">
            <div style="display:flex;align-items:flex-end;gap:3px;height:32px">
              <div style="width:7px;height:13px;background:#199C9A;border-radius:3px"></div>
              <div style="width:7px;height:21px;background:#199C9A;border-radius:3px"></div>
              <div style="width:7px;height:30px;background:#353266;border-radius:3px"></div>
            </div>
            <div>
              <div style="font-size:18px;font-weight:800;color:#353266;letter-spacing:-.3px">Grupo Finvivir</div>
              <div style="font-size:11px;color:#8B91A8">Plataforma de Recuperación</div>
            </div>
          </div>
          <div style="font-size:22px;font-weight:800;color:#1E1B40;margin-bottom:6px">Iniciar sesión</div>
          <div style="font-size:13px;color:#8B91A8;margin-bottom:28px">Ingresa tus credenciales para continuar</div>
          <!-- Usuario -->
          <div style="margin-bottom:16px">
            <label style="display:block;font-size:12px;font-weight:700;color:#353266;
                   text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px">
              Correo electrónico
            </label>
            <input id="loginEmail" type="email" placeholder="nombre.apellido@finvivir.com"
              style="width:100%;padding:12px 16px;border:2px solid #E2E5EE;border-radius:12px;
                     font-size:14px;color:#2D3142;transition:border-color .15s;outline:none"
              onfocus="this.style.borderColor='#199C9A'"
              onblur="this.style.borderColor='#E2E5EE'"
              onkeydown="if(event.key==='Tab'){event.preventDefault();document.getElementById('loginPass').focus()}"
              oninput="document.getElementById('loginError').style.display='none'">
          </div>
          <!-- Contraseña -->
          <div style="margin-bottom:8px">
            <label style="display:block;font-size:12px;font-weight:700;color:#353266;
                   text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px">
              Contraseña
            </label>
            <div style="position:relative">
              <input id="loginPass" type="password" placeholder="Tu contraseña" onkeydown="if(event.key==='Enter')doLogin()"
                style="width:100%;padding:12px 44px 12px 16px;border:2px solid #E2E5EE;border-radius:12px;
                       font-size:14px;color:#2D3142;transition:border-color .15s;outline:none"
                onfocus="this.style.borderColor='#199C9A'"
                onblur="this.style.borderColor='#E2E5EE'"
                onkeydown="if(event.key==='Enter')doLogin()"
                oninput="document.getElementById('loginError').style.display='none'">
              <button onclick="const i=document.getElementById('loginPass');i.type=i.type==='password'?'text':'password'"
                style="position:absolute;right:14px;top:50%;transform:translateY(-50%);
                       background:none;border:none;color:#8B91A8;cursor:pointer;font-size:16px">👁</button>
            </div>
            <div style="font-size:11px;color:#8B91A8;margin-top:5px">La contraseña debe tener al menos 8 caracteres</div>
          </div>
          <!-- Error -->
          <div id="loginError" style="display:none;background:#FEF2F2;border:1px solid #FECACA;
               border-radius:8px;padding:10px 14px;font-size:12.5px;color:#DC2626;margin-bottom:12px">
            Correo o contraseña incorrectos. Intenta de nuevo.
          </div>
          <!-- Botón Ingresar -->
          <button id="btnLogin" onclick="doLogin()"
            style="width:100%;padding:14px;background:linear-gradient(135deg,#199C9A,#0D6B69);
                   color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;
                   cursor:pointer;margin-top:8px;transition:opacity .15s;letter-spacing:.2px"
            onmouseover="this.style.opacity='.9'" onmouseout="this.style.opacity='1'">
            Ingresar al sistema →
          </button>
          <!-- Selector de rol para el prototipo -->
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #E2E5EE;
               font-size:11px;color:#8B91A8;text-align:center">
            <div style="font-weight:700;margin-bottom:8px;color:#353266">Demo: selecciona un perfil</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px" id="demoRoles"></div>
          </div>
          <div style="margin-top:12px;text-align:center;font-size:11px;color:#8B91A8">
            ¿Problemas de acceso? Contacta al Administrador de Seguridad de tu país.
          </div>
          <div style="margin-top:8px;text-align:center;font-size:10.5px;color:#C5C8D2">
            © 2026 Grupo Finvivir · Prototipo v1.0 · Confidencial
          </div>
        </div>
      </div>`;
    document.body.appendChild(loginEl);
    /* Accesos rápidos por perfil: solo en MODO_DEMO. Apagar el parámetro los
       oculta y obliga a que cada usuario entre con su propia contraseña, que es
       lo que se requiere para una prueba de campo. */
    if(!P('MODO_DEMO')){
      const cont=document.getElementById('demoRoles');
      if(cont && cont.parentElement) cont.parentElement.style.display='none';
    }
    const roles=P('MODO_DEMO') ? Object.keys(ROLES).filter(k=>k!=='ic') : [];
    document.getElementById('demoRoles').innerHTML=roles.map(k=>
      `<button onclick="ingresarComo('${k}')"
        style="padding:8px 10px;border:1.5px solid #E2E5EE;border-radius:8px;
               background:#F8FAFC;color:#353266;cursor:pointer;font-size:11px;font-weight:600;
               transition:all .15s;text-align:left"
        onmouseover="this.style.background='#EBF9F8';this.style.borderColor='#199C9A'"
        onmouseout="this.style.background='#F8FAFC';this.style.borderColor='#E2E5EE'">
        ${ROLES[k].persona}<br><span style="font-size:9.5px;color:#8B91A8;font-weight:400">${ROLES[k].label}</span>
      </button>`).join('');
  }
  loginEl.style.display='block';
}

/* ══════════════════════════════════════════════════════════════════════
   AUTENTICACIÓN
   Verifica la contraseña contra un hash SHA-256 con salt del correo.
   LÍMITE REAL Y DELIBERADO: en un HTML sin servidor los hashes viajan al
   navegador, así que esto NO protege datos — quien abra el código los ve.
   Sirve para que cada usuario entre solo con su cuenta y para ejercer el
   flujo real de login (intentos, bloqueo, vencimiento). La protección de
   verdad la da el hosting con Entra ID o la migración a Power Apps.
   ══════════════════════════════════════════════════════════════════════ */
async function hashPass(correo, pass){
  const texto = correo.toLowerCase() + ':' + pass;
  if (window.crypto && window.crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  /* Respaldo para navegadores sin crypto.subtle: no es criptográfico, solo
     evita dejar la contraseña legible. Se marca para no confundirlo. */
  let h1=0x811c9dc5, h2=0x01000193;
  for(let i=0;i<texto.length;i++){ h1=(h1^texto.charCodeAt(i))*16777619>>>0; h2=(h2+texto.charCodeAt(i)*31)>>>0; }
  return 'fallback:'+h1.toString(16)+h2.toString(16);
}

async function doLogin(){
  const email=document.getElementById('loginEmail').value.trim();
  const pass=document.getElementById('loginPass').value;
  const err=document.getElementById('loginError');
  const btn=document.getElementById('btnLogin');
  const mostrarError=msg=>{ err.textContent=msg; err.style.display='block'; };
  err.style.display='none';

  if(!email){ mostrarError('Ingresa tu correo electrónico.'); return; }
  if(!pass){  mostrarError('Ingresa tu contraseña.'); return; }

  const usuario=DB.usuarios.find(u=>(u.c||'').toLowerCase()===email.toLowerCase());

  /* Mensaje deliberadamente genérico cuando el correo no existe: decir "ese
     correo no está registrado" permitiría averiguar qué correos son válidos. */
  if(!usuario){
    mostrarError('Correo o contraseña incorrectos.');
    log('Intento de acceso fallido', `Correo no registrado: ${esc(email)}`, 'Credenciales inválidas', '—', 'Rechazado');
    return;
  }
  if(usuario.estatus!=='Activo'){
    mostrarError(`La cuenta de ${usuario.n} está en estatus «${usuario.estatus}» y no puede iniciar sesión. Contacta al Administrador de Seguridad.`);
    log('Intento de acceso fallido', `${usuario.n} — cuenta ${usuario.estatus}`, usuario.motivoBaja||'Cuenta no activa', usuario.estatus, 'Rechazado');
    return;
  }

  if(btn){ btn.disabled=true; btn.textContent='Verificando…'; }
  const hash=await hashPass(usuario.c, pass);
  if(btn){ btn.disabled=false; btn.textContent='Ingresar al sistema →'; }

  if(!usuario.passHash || hash!==usuario.passHash){
    usuario.intentosFallidos=(usuario.intentosFallidos||0)+1;
    const max=P('MAX_INTENTOS_FALLIDOS'), restantes=max-usuario.intentosFallidos;
    if(usuario.intentosFallidos>=max){
      usuario.estatus='Bloqueado';
      usuario.motivoBaja=`Bloqueo automático por ${usuario.intentosFallidos} intentos fallidos consecutivos.`;
      mostrarError(`Cuenta bloqueada por ${usuario.intentosFallidos} intentos fallidos. Contacta al Administrador de Seguridad.`);
      log('Bloqueo de usuario', `${usuario.n} — bloqueo automático`, usuario.motivoBaja, 'Activo', 'Bloqueado');
    } else {
      mostrarError(`Correo o contraseña incorrectos. Te ${restantes===1?'queda 1 intento':`quedan ${restantes} intentos`} antes de que la cuenta se bloquee.`);
      log('Intento de acceso fallido', `${usuario.n} — contraseña incorrecta (${usuario.intentosFallidos} de ${max})`, 'Credenciales inválidas', usuario.intentosFallidos-1, usuario.intentosFallidos);
    }
    return;
  }

  /* Contraseña correcta. Política de vencimiento a 90 días. */
  const dv=diasHasta(usuario.passVence);
  if(dv!==null && dv<0){
    mostrarError(`Tu contraseña venció hace ${Math.abs(dv)} días (${usuario.passVence}). Contacta al Administrador de Seguridad para restablecerla.`);
    log('Intento de acceso fallido', `${usuario.n} — contraseña vencida`, `Venció el ${usuario.passVence}`, '—', 'Rechazado');
    return;
  }

  const rolEncontrado=Object.keys(ROLES).find(k=>ROLES[k].persona===usuario.n)
                   || Object.keys(ROLES).find(k=>ROLES[k].label===usuario.rol);
  if(!rolEncontrado){
    mostrarError(`${usuario.n} no tiene un perfil de acceso configurado para este sistema.`);
    log('Intento de acceso fallido', `${usuario.n} — sin perfil configurado`, `Rol "${usuario.rol}" sin pantalla asociada`, '—', 'Rechazado');
    return;
  }

  usuario.intentosFallidos=0;
  usuario.ultimo=`${fecha(HOY)} ${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}`;
  usuario.sesionesActivas=(usuario.sesionesActivas||0)+1;
  window.usuarioSesion=usuario;
  log('Acceso al sistema', `${usuario.n} · ${usuario.rol}`, 'Ingreso con credenciales válidas', '—', 'Sesión iniciada');

  if(dv!==null && dv<=10) toast(`Tu contraseña vence en ${dv} día${dv===1?'':'s'}. Solicita el cambio al Administrador de Seguridad.`,'bad');
  ingresarComo(rolEncontrado);
}

/* ══════════════════════════════════════════════════════════════════════
   PIEZAS DE LA PRUEBA DE CAMPO
   ══════════════════════════════════════════════════════════════════════ */

/* Marca que hubo captura en esta sesión, para advertir antes de perderla.
   Se activa desde log(), que ya registra toda acción con efecto. */
window.huboCapturas = false;

function aplicarBannerSimulacion(){
  const b=document.getElementById('bannerSim');
  if(!b) return;
  const on=P('BANNER_SIMULACION');
  b.style.display = on ? 'block' : 'none';
  /* Deja aire al final para que el banner no tape el contenido ni los botones. */
  document.body.style.paddingBottom = on ? '34px' : '';
}

function cerrarMiSesion(){
  const u=window.usuarioSesion;
  const aviso = window.huboCapturas
    ? `<div class="note bad" style="margin-bottom:14px"><b>Tienes capturas de esta sesión.</b>
         Este prototipo no guarda información: al cerrar sesión se pierden las gestiones,
         pagos y dictaminaciones que registraste.</div>`
    : '';
  modal(`<h3>⏏ Cerrar sesión</h3>
    <p class="sub">${u?esc(u.n):'Usuario'} · ${u?esc(u.rol):''}</p>
    ${aviso}
    <p style="font-size:13px;color:var(--text2);line-height:1.5">
      Volverás a la pantalla de inicio de sesión y tendrás que capturar tus credenciales de nuevo.</p>
    <div class="mfoot">
      <button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act" onclick="confirmarCerrarSesion()">Cerrar sesión</button>
    </div>`);
}

function confirmarCerrarSesion(){
  const u=window.usuarioSesion;
  if(u){
    u.sesionesActivas=Math.max(0,(u.sesionesActivas||1)-1);
    log('Cierre de sesión',`${u.n} · ${u.rol}`,'Cierre de sesión solicitado por el propio usuario','Sesión activa','Sesión cerrada');
  }
  window.usuarioSesion=null;
  window.huboCapturas=false;
  closeModal();
  /* Se limpia el estado de filtros y expansiones para que el siguiente usuario
     no herede lo que dejó el anterior. */
  ['tjFiltroEj','tjFiltroMarca','tjFiltroRegion','gerFiltroEj','gerFiltroMarca','gerFiltroRegion',
   'gerFiltroJef','cgFiltroJef','cgFiltroEj','cgFiltroGrupo','cgFiltroQ','fEqQ','fEqMarca','fEqRuta',
   'fEqRegion','fEqEst','usuBusq','usuFiltroRol','usuFiltroEst','bitBusq','bitFAccion',
   'dictJefeBusq','dictGerBusq','falcoBusq','catBusqCatalogo','catBusqHist','agendaEjFiltro'
  ].forEach(k=>{ if(k in window) window[k]=''; });
  window.ejAbiertos=new Set(); window.gruposAbiertos=new Set();
  window.semOffset=0; window.bitPage=0; window.gerView='ejecutiva';
  const li=document.getElementById('loginScreen'); if(li) li.remove();
  mostrarLogin();
}

/* Abre WhatsApp o el correo con la pantalla y el perfil ya escritos, para que
   el hallazgo no dependa de que el ejecutivo lo recuerde al final del día. */
function reportarHallazgo(){
  const canal=String(P('CANAL_REPORTE')||'').trim();
  if(!canal){ toast('No hay canal de reporte configurado. Pídelo al Administrador de Configuración.','bad'); return; }
  const u=window.usuarioSesion;
  const pantalla=(typeof NAV!=='undefined' && NAV[currentView]) ? NAV[currentView] : currentView;
  const asunto=`Hallazgo · ${pantalla}`;
  const cuerpo=`Hallazgo en la prueba de campo\n\n`
    +`Pantalla: ${pantalla}\n`
    +`Perfil: ${u?u.rol:currentRole}\n`
    +`Usuario: ${u?u.n:'—'}\n`
    +`Fecha: ${fecha(HOY)} ${String(new Date().getHours()).padStart(2,'0')}:${String(new Date().getMinutes()).padStart(2,'0')}\n\n`
    +`Qué esperaba que pasara:\n\n\n`
    +`Qué pasó en realidad:\n\n`;
  const esCorreo=canal.includes('@');
  const url = esCorreo
    ? `mailto:${encodeURIComponent(canal)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    : `https://wa.me/${canal.replace(/\D/g,'')}?text=${encodeURIComponent(cuerpo)}`;
  window.__reporteTexto = cuerpo;
  window.__reporteUrl   = url;
  /* Muchos teléfonos personales no tienen app de correo configurada: si mailto
     no abre nada, el hallazgo se perdería en silencio. Por eso el texto se
     muestra siempre, con opción de copiarlo y enviarlo por el medio que sea. */
  modal(`<h3>💬 Reportar algo de esta pantalla</h3>
    <p class="sub">${esc(pantalla)} · ${esc(u?u.rol:currentRole)}</p>
    <div class="note info" style="margin-bottom:12px">
      Completa las dos preguntas y envíalo. Si el botón de correo no abre nada en tu
      teléfono, usa <b>Copiar</b> y pégalo donde te sea más fácil.
    </div>
    <div class="field">
      <label for="repTexto">Reporte (edítalo antes de enviar)</label>
      <textarea id="repTexto" style="min-height:200px;font-family:ui-monospace,monospace;font-size:12px">${esc(cuerpo)}</textarea>
    </div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:10px">Se enviará a ${esc(canal)}</div>
    <div class="mfoot">
      <button class="act o" onclick="closeModal()">Cancelar</button>
      <button class="act o" onclick="copiarReporte()">📋 Copiar</button>
      <button class="act" onclick="enviarReporte()">${esCorreo?'✉️ Abrir correo':'Abrir WhatsApp'}</button>
    </div>`);
}

function copiarReporte(){
  const t=(document.getElementById('repTexto')||{}).value||window.__reporteTexto||'';
  const ok=()=>toast('Reporte copiado. Pégalo en un correo o mensaje y envíalo.','ok');
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(ok).catch(()=>fallbackCopiar(t,ok));
  } else fallbackCopiar(t,ok);
}
function fallbackCopiar(t,ok){
  const ta=document.getElementById('repTexto');
  if(ta){ ta.focus(); ta.select(); try{ document.execCommand('copy'); ok(); return; }catch(e){} }
  toast('No se pudo copiar automáticamente. Selecciona el texto y cópialo a mano.','bad');
}
function enviarReporte(){
  const canal=String(P('CANAL_REPORTE')||'').trim();
  const t=(document.getElementById('repTexto')||{}).value||window.__reporteTexto||'';
  const pantalla=(typeof NAV!=='undefined' && NAV[currentView]) ? NAV[currentView] : currentView;
  const url = canal.includes('@')
    ? `mailto:${encodeURIComponent(canal)}?subject=${encodeURIComponent('Hallazgo · '+pantalla)}&body=${encodeURIComponent(t)}`
    : `https://wa.me/${canal.replace(/\D/g,'')}?text=${encodeURIComponent(t)}`;
  window.open(url,'_blank');
  closeModal();
  toast('Si no se abrió tu correo, vuelve a pulsar el botón y usa Copiar.','bad');
}

/* Advierte antes de cerrar o refrescar si hay capturas que se van a perder. */
window.addEventListener('beforeunload', function(e){
  if(window.huboCapturas && window.usuarioSesion){
    e.preventDefault(); e.returnValue='';
    return '';
  }
});

function ingresarComo(rol){
  /* El selector "Ver como" permite cambiar de perfil sin autenticarse: es útil
     para demostrar el sistema, pero invalida una prueba de campo. Se oculta
     cuando MODO_DEMO está apagado. */
  const _sw=document.getElementById('roleSwitch');
  if(_sw) _sw.style.display = P('MODO_DEMO') ? '' : 'none';
  aplicarBannerSimulacion();
  const _br=document.getElementById('btnReportar');
  if(_br) _br.style.display = String(P('CANAL_REPORTE')||'').trim() ? 'block' : 'none';
  const loginEl=document.getElementById('loginScreen');
  if(loginEl) loginEl.style.display='none';
  const main=document.getElementById('appMain');
  const side=document.getElementById('appSide');
  const top=document.querySelector('.topbar');
  if(main) main.style.display='';
  if(side) side.style.display='';
  if(top)  top.style.display='';
  initRoles(); setRole(rol);
}

initRoles();
// Mostrar login al iniciar
mostrarLogin();
