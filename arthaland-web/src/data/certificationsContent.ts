import type { FaqItem } from './faqs'
import { certificationLogos } from '../config/certificationLogos'

export const certificationStandards = [
  {
    id: 'leed',
    number: '01',
    name: 'LEED',
    fullName: 'Leadership in Energy and Environmental Design',
    tagline: 'Building with environmental responsibility in mind.',
    intro:
      'LEED is one of the world\'s most widely recognized green building rating systems. Developed by the U.S. Green Building Council, it provides a comprehensive framework for evaluating the environmental performance of buildings. It considers how buildings use energy and water, select materials, manage waste, and provide healthy indoor environments.',
    focusTitle: 'What LEED focuses on',
    focusItems: [
      { title: 'Energy Efficiency', body: 'Encouraging efficient building systems and design strategies that reduce unnecessary energy consumption.' },
      { title: 'Water Conservation', body: 'Supporting responsible water management through efficient fixtures, systems, and conservation measures.' },
      { title: 'Sustainable Materials', body: 'Promoting thoughtful material selection and responsible construction practices that consider environmental impacts.' },
      { title: 'Indoor Environmental Quality', body: 'Recognizing design strategies that support healthier and more comfortable interior environments.' },
      { title: 'Overall Environmental Performance', body: 'Encouraging a holistic approach that considers the building\'s environmental impact throughout relevant stages of its life cycle.' },
    ],
    whyTitle: 'Why LEED matters to property buyers',
    whyBody: [
      'When you choose a development designed around LEED principles, you are considering more than its appearance or location. You are also looking at how the building has been planned to use resources responsibly, support indoor environmental quality, and achieve measurable sustainability objectives.',
      'Depending on the building\'s specific systems and performance, these strategies may contribute to reduced resource consumption and a more comfortable living environment.',
    ],
    pullQuote: 'A thoughtfully designed building considers not only how it looks today, but how it performs over time.',
    logo: certificationLogos[2],
  },
  {
    id: 'berde',
    number: '02',
    name: 'BERDE',
    fullName: 'Building for Ecologically Responsive Design Excellence',
    tagline: 'A Philippine approach to responsible development.',
    intro:
      'BERDE is the Philippines\' national voluntary green building rating system, developed by the Philippine Green Building Council. It provides a framework for assessing, measuring, monitoring, and verifying the environmental performance of building projects against criteria that go beyond minimum regulatory requirements. Its approach is particularly relevant to Philippine developments, where local environmental conditions, resource management, and responsible urban development are important considerations.',
    focusTitle: 'What BERDE focuses on',
    focusItems: [
      { title: 'Climate-Responsive Design', body: 'Encouraging building strategies that account for Philippine environmental conditions and local project context.' },
      { title: 'Efficient Resource Management', body: 'Evaluating responsible approaches to energy, water, and other resources.' },
      { title: 'Responsible Development', body: 'Supporting environmental considerations throughout planning, construction, and building operations.' },
      { title: 'Environmental Performance', body: 'Providing a structured system for assessing whether a project meets recognized sustainability criteria.' },
      { title: 'Long-Term Building Responsibility', body: 'Encouraging property developers to consider the ongoing environmental performance of their projects.' },
    ],
    whyTitle: 'Why BERDE matters to property buyers',
    whyBody: [
      'A building developed with BERDE principles considers how sustainable design can be applied within the Philippine setting. For buyers, this is important because the performance of a property is influenced by its climate, surroundings, building systems, and management practices.',
      'A climate-responsive development can help support comfortable living conditions and more responsible resource use.',
    ],
    pullQuote: 'Sustainability becomes more meaningful when it responds to the environment in which we actually live.',
    logo: certificationLogos[1],
  },
  {
    id: 'well',
    number: '03',
    name: 'WELL',
    fullName: 'WELL Building Standard',
    tagline: 'Designing spaces with people at the center.',
    intro:
      'A beautiful home should also support the comfort and well-being of the people who live in it. The WELL Building Standard provides an evidence-informed framework that focuses on how the built environment can affect human health, comfort, and quality of life. Rather than concentrating solely on environmental efficiency, WELL explores how building design, operations, and occupant experience can contribute to better indoor environments.',
    focusTitle: 'What WELL focuses on',
    focusItems: [
      { title: 'Air Quality', body: 'Encouraging strategies that address indoor air pollutants and support cleaner, healthier indoor air.' },
      { title: 'Water Quality', body: 'Recognizing the importance of water quality and responsible water management within buildings.' },
      { title: 'Lighting', body: 'Supporting appropriate lighting conditions, visual comfort, and healthy daily rhythms.' },
      { title: 'Thermal Comfort', body: 'Considering temperature, humidity, and related indoor conditions that influence occupant comfort.' },
      { title: 'Acoustic Comfort', body: 'Encouraging building environments that consider noise and sound-related comfort.' },
      { title: 'Movement and Wellness', body: 'Promoting built environments that can encourage physical activity and support healthier lifestyles.' },
      { title: 'Mental Well-Being', body: 'Recognizing the relationship between the spaces people occupy and their overall well-being.' },
    ],
    whyTitle: 'Why WELL matters to property buyers',
    whyBody: [
      'Imagine coming home to a residence designed with natural light, appropriate ventilation, thermal comfort, and indoor environmental quality in mind. These considerations may influence how comfortable a space feels throughout everyday activities, from working and resting to spending time with family.',
      'For property buyers, wellness-oriented building design provides another perspective when evaluating a condominium. It encourages you to ask not only whether a unit is beautiful, but also whether its environment supports the way you want to live.',
    ],
    pullQuote: 'A well-designed home should consider the people who experience it every day.',
    logo: certificationLogos[3],
  },
  {
    id: 'edge',
    number: '04',
    name: 'EDGE',
    fullName: 'Excellence in Design for Greater Efficiencies',
    tagline: 'Smarter resource use. Measurable sustainability goals.',
    intro:
      'EDGE is an international green building certification system developed by the International Finance Corporation, a member of the World Bank Group. EDGE focuses on measurable resource efficiency, helping developers identify building design strategies that can reduce the consumption of energy and water while lowering the embodied environmental impact of construction materials. For standard EDGE certification, a project must demonstrate at least 20% projected savings in three areas compared with the applicable local baseline.',
    focusTitle: 'The Three Core EDGE Requirements',
    focusItems: [
      { title: '20% or More — Energy Savings', body: 'A minimum projected reduction in energy consumption compared with the applicable baseline building.' },
      { title: '20% or More — Water Savings', body: 'A minimum projected reduction in water consumption through efficient design and building systems.' },
      { title: '20% or More — Embodied Energy Savings in Materials', body: 'A minimum projected reduction in embodied energy associated with building materials, using the applicable EDGE assessment method.' },
    ],
    whyTitle: 'Why EDGE matters to property buyers',
    whyBody: [
      'Energy and water efficiency can be relevant to both environmental responsibility and the ongoing cost of living in a building. Depending on how a property performs in practice, resource-efficient design may contribute to lower consumption and more responsible operations.',
      'EDGE gives buyers a measurable framework for understanding the environmental objectives behind specific building-design decisions. It is important to remember that projected savings are measured against defined baselines. They are not a guarantee that every household will experience the same reduction in utility bills.',
    ],
    pullQuote: 'A more efficient building begins with smarter decisions about how resources are used.',
    logo: certificationLogos[0],
  },
] as const

export const sustainabilityReasons = [
  {
    title: 'A More Comfortable Living Environment',
    body: 'Thoughtful building design may contribute to better natural lighting, ventilation, temperature management, and indoor environmental quality. These features can help create spaces that feel more comfortable and enjoyable throughout the day.',
  },
  {
    title: 'More Responsible Resource Consumption',
    body: 'Energy-efficient systems, water-saving technologies, and thoughtful design strategies can help reduce unnecessary resource use. Depending on actual building performance and individual usage, these features may also support more manageable utility consumption.',
  },
  {
    title: 'Healthier Spaces for Everyday Life',
    body: 'The environments we occupy influence our daily routines. Building strategies that consider air, water, lighting, acoustics, and thermal comfort can contribute to a more wellness-oriented residential experience.',
  },
  {
    title: 'Consideration for Long-Term Building Performance',
    body: 'Sustainable building practices encourage developers to consider how a building will perform beyond its initial construction. Quality systems, responsible material choices, and ongoing maintenance remain important factors in long-term property performance.',
  },
  {
    title: 'Environmental Responsibility',
    body: 'Every development has an environmental footprint. By considering energy, water, materials, and operational efficiency, sustainable buildings can help reduce certain environmental impacts compared with less efficient alternatives.',
  },
  {
    title: 'A More Informed Property Decision',
    body: 'Recognized certification systems provide buyers with additional information when comparing developments. They encourage important questions about actual building performance, certification status, resource efficiency, and long-term management.',
  },
] as const

export const buyerQuestions = [
  'Which green building certifications has this specific development already achieved?',
  'Which certifications are registered, targeted, or still undergoing assessment?',
  'What energy and water efficiency measures are incorporated into the building?',
  'What features support indoor environmental quality and occupant comfort?',
  'Are there available reports or documents describing the project\'s sustainability performance?',
  'What operational and maintenance practices support the development\'s long-term performance?',
] as const

export const certificationsFaq: FaqItem[] = [
  {
    q: 'What is a green building certification?',
    a: 'A green building certification is a formal assessment under an established rating system that evaluates selected aspects of a building\'s environmental or human-centered performance. Requirements differ between certification systems.',
  },
  {
    q: 'Are LEED, BERDE, WELL, and EDGE the same?',
    a: 'No. Although these systems share an interest in better buildings, they have different assessment criteria. LEED considers broad environmental performance, BERDE provides a Philippine green building assessment framework, WELL emphasizes health and well-being, and EDGE focuses on measurable resource efficiency.',
  },
  {
    q: 'Does a green building automatically have lower electricity bills?',
    a: 'Not necessarily. Efficient building design may help reduce energy consumption, but actual electricity costs depend on the unit\'s equipment, occupants\' behavior, utility rates, building operations, and other factors.',
  },
  {
    q: 'Does WELL certification mean residents will never experience health problems?',
    a: 'No. WELL focuses on building-related strategies that can support health and well-being. It does not guarantee individual health outcomes.',
  },
  {
    q: 'Does EDGE guarantee 20% lower utility bills?',
    a: 'No. EDGE\'s standard certification requirements concern projected savings relative to defined baselines, not guaranteed reductions in each household\'s bills.',
  },
  {
    q: 'Does certification guarantee property appreciation?',
    a: 'No. Property values depend on market demand, location, economic conditions, project management, and many other factors. Sustainability may be one consideration, but it cannot guarantee financial returns.',
  },
  {
    q: 'Are all ARTHALAND developments certified under all four systems?',
    a: 'Certification varies by development. Buyers should review the specific property\'s documented certification status, including whether a certification has been achieved, is registered, or remains a target.',
  },
  {
    q: 'Can I ask about the sustainability features of a particular ARTHALAND property?',
    a: 'Yes. You can contact the property sales team to inquire about available development information, project features, and documented sustainability credentials.',
  },
]
