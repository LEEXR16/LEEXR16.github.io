/* =====================================================================
   ALL SITE CONTENT LIVES IN THIS FILE.
   Edit text here; you never need to touch the HTML.
   Anything written in [square brackets] is a placeholder: it shows up
   highlighted in amber on the site until you replace it.

   IMAGES: drop files into assets/img/ using these names and they
   appear automatically (jpg, png or webp all work):
     assets/img/profile.jpg              your photo
     assets/img/additive.jpg             workshop / prototype photo on the landing page (21:9)
     assets/img/<project-id>/cover.jpg   card image
     assets/img/<project-id>/hero.jpg    large image on the project page
     assets/img/<project-id>/1.jpg ... 6.jpg   gallery
   ===================================================================== */

window.SITE = {
  name: "Lishwanth R K",
  callsign: "LEE",
  title: "Design and Automation Engineer",
  field: "Mechatronic Systems",
  /* project count shown in the landing stats (can be higher than the projects listed below) */
  projectCount: 11,
  /* landing page "Featured projects", in this order (project ids) */
  featured: ["dynabo", "noark-plus", "atobot", "mars"],
  institution: "[Your lab / institution]",
  /* factual current role, shown once on the About page. Delete the text to hide it. */
  current: "Currently a Research Assistant at [Your lab / institution]",
  tagline:
    "I take ideas from the drawing board to a working prototype, and I believe in CNC machining and additive manufacturing for a fast, efficient workflow.",
  typed: [
    "ideation",
    "mechanical design",
    "automation",
    "CNC machining",
    "additive manufacturing",
    "rapid prototyping",
  ],
  /* landing page "Dossier": a rewrite of the LinkedIn bio */
  dossier: [
    "I'm a design and automation engineer who learns by building. I work where mechanical design, electronics and control meet, turning concepts into functional hardware, most of it for rehabilitation robotics and mechatronic systems.",
    "My work covers multi-DOF platforms, motor-driven actuation, force and torque sensing, and closed-loop control, turning real-world constraints into practical designs. I'm most drawn to human-centric machines, where safety and usability count as much as performance.",
  ],
  /* About page: the LinkedIn bio */
  bio: [
    "I'm a hands-on tinkerer working at the intersection of mechanical design, electronics, and control systems. My work focuses on building functional hardware, from concept to prototype, with a strong emphasis on rehabilitation robotics and mechatronic systems.",
    "I actively work on multi-DOF platforms, motor-driven actuation systems, force/torque sensing, and feedback-driven control, translating real-world constraints into practical designs. My experience spans CAD and simulation, rapid prototyping, embedded systems, and automation.",
    "I enjoy breaking down complex problems, experimenting iteratively, and learning by building. Currently, I'm exploring human-centric machines where precision, safety, and usability matter as much as engineering performance.",
  ],
  process: [
    { step: "Ideate", text: "Approach the problem statement methodically, then use engineering methods to generate an efficient solution." },
    { step: "Design", text: "Give the idea form, applying ergonomics and usability. The aim is the simplest suitable solution, without compromising the idea." },
    { step: "Prototype", flag: "AM + CNC", key: true, text: "From 3D printing to metal fabrication to carbon fibre composites, I work with a range of materials for demanding projects." },
    { step: "Produce", text: "Working on reducing the time it takes to go from ideation to prototype." },
  ],
  education: [
    { year: "[Year]", what: "MTech, CAD/CAM", where: "[Institution]" },
    { year: "[Year]", what: "BTech, Mechatronics", where: "[Institution]" },
  ],
  skills: [
    { group: "Ideation and design", items: ["Concept development and ideation", "Mechanism and linkage design", "Chassis and enclosure design", "CAD modelling (Autodesk Fusion)", "DFMA and DFAM", "[Other CAD / analysis tools]"] },
    { group: "Additive manufacturing", items: ["Design for additive manufacturing", "Printed structural and functional parts", "Fast design-print-test iteration"] },
    { group: "Prototyping and fabrication", items: ["Rapid prototyping", "M.S, S.S, aluminium and carbon fibre", "Machining and sheet metal fabrication", "Prototype assembly and testing", "PCB design"] },
    { group: "Mechatronic integration", items: ["Actuation", "Teensy, ESP32, Arduino, Raspberry Pi", "Load cells and sensors"] },
  ],
  links: [
    { label: "Email", value: "lee1792000@gmail.com", href: "mailto:lee1792000@gmail.com" },
    { label: "LinkedIn", value: "linkedin.com/in/lishwanthrk17", href: "https://www.linkedin.com/in/lishwanthrk17" },
    { label: "GitHub", value: "github.com/LEEXR16", href: "https://github.com/LEEXR16" },
    { label: "CV", value: "Download CV (add cv.pdf to the site folder)", href: "cv.pdf" },
  ],
};

/* ---------------------------------------------------------------------
   PROJECTS
   To add one: copy a block, change the id, and create a matching
   folder in assets/img/. Order here is the order on the site.
   area:   upper | lower | balance | trunk | hand | other
   state:  active | design | built
   group:  true marks it as a group project
   featured: true shows it on the landing page
   --------------------------------------------------------------------- */
window.PROJECTS = [
  {
    id: "mars",
    name: "MARS v3.1",
    full: "Motorised Armassist Robot System",
    area: "upper",
    state: "active",
    status: "Active build",
    group: false,
    featured: true,
    tagline: "A single-actuator system that supports the weight of the arm while it moves through a 0 to 120° plane.",
    tags: ["Upper limb", "Arm support", "CAN", "Torque control"],
    problem:
      "People recovering arm function often cannot lift the arm against gravity, so they cannot practise the movements they need to relearn. MARS takes the weight of the arm so the patient can work on the movement itself.",
    approach:
      "One actuator carries the arm through a plane from 0 to 120°. Load cells under the motor mount measure what the arm is doing, and a modelled gravity torque is applied as feedforward. A Challenge Point Controller is the next step, so the support adapts to how well the patient is doing.",
    build: "The arm links are built from aluminium and carbon fibre rods. [Add which parts are printed, and in what process and material.]",
    role: "[Your role on MARS, e.g. mechanical redesign, actuator integration, firmware, GUI]",
    specs: [
      ["Actuator", "CubeMars AK10-9 V2 over CAN (AK60-39 V3 planned)"],
      ["Controller", "Teensy, master / slave"],
      ["Sensing", "4 × 100 kg load cells under the motor mount, ADS1261"],
      ["Structure", "Aluminium and carbon fibre links"],
      ["Interface", "Python GUI"],
      ["Auxiliary", "24 V solenoids, MOSFET drive, compact control PCB in design"],
    ],
  },
  {
    id: "noark-plus",
    name: "NOARK+",
    full: "Motor-assisted upper-limb system with gravity support",
    area: "upper",
    state: "active",
    status: "Active build",
    group: false,
    featured: true,
    tagline: "A motor-assisted version of NOARK that adds active help to gravity-supported arm training.",
    tags: ["Upper limb", "Gravity support", "Torque mode", "Raspberry Pi"],
    problem:
      "NOARK is an upper-limb rehabilitation device from CMC Vellore. NOARK+ extends it with motors, so the device can assist the movement as well as support the arm.",
    approach:
      "Two actuators run in torque mode and are commanded from a Raspberry Pi 5 using the manufacturer's drivers. [Add a line on the assistance strategy and what has been tested so far.]",
    build: "[How it is made: printed parts, materials, processes.]",
    role: "[Your role on NOARK+]",
    specs: [
      ["Actuators", "2 × CubeMars AKE90-8, torque mode"],
      ["Controller", "Raspberry Pi 5"],
      ["Drivers", "CubeMars drivers"],
      ["Base device", "NOARK (CMC Vellore)"],
    ],
  },
  {
    id: "dynabo",
    name: "DYNABO",
    full: "Dynamic Balance Board",
    area: "balance",
    state: "active",
    status: "Active build",
    group: false,
    featured: true,
    tagline: "A family of instrumented balance boards for neuro-rehabilitation.",
    tags: ["Balance", "Load cells", "PCB design"],
    problem:
      "Balance training is repetitive and hard to measure. DYNABO instruments it, so a clinician can quantify progress.",
    approach:
      "Each board reads load cells through an ADS1261 amplifier, with the electronics on a custom PCB designed in Autodesk Fusion. The first build is the RR board.",
    build: "[How it is made: printed parts, materials, processes.]",
    role: "[Your role on DYNABO]",
    specs: [
      ["Sensing", "Load cells, ADS1261 amplifier board"],
      ["Electronics", "Custom PCB, Autodesk Fusion"],
      ["First board", "RR board"],
      ["Presented", "Poster and live demo, CMC Vellore Annual Research Day 2026"],
    ],
  },
  {
    id: "hoist",
    name: "HOIST",
    full: "Motor-driven cable resistance system",
    area: "trunk",
    state: "design",
    status: "In design",
    group: false,
    featured: false,
    tagline: "A motor and pulley system that applies controlled resistance through a cable to a trunk harness.",
    tags: ["Trunk", "Cable drive", "Tension control"],
    problem:
      "[Add the clinical need: who this is for and what training it enables.]",
    approach:
      "A motor drives a cable over pulleys and sets the resistance. Cable tension is measured and fed back to the motor controller. The cable ends at a rigid top bar on a trunk harness, which branches to front and back shoulder straps on each side.",
    build: "[How it is made: printed parts, materials, processes.]",
    role: "[Your role on HOIST]",
    specs: [
      ["Drive", "Motor and pulley, tension-controlled"],
      ["Cable", "UHMWPE (under evaluation)"],
      ["Tension sensing", "Idler-pulley or harness-mounted load cell (under evaluation)"],
      ["Cable travel", "About 300 to 1000 mm"],
      ["Patient interface", "Trunk harness with rigid top bar"],
    ],
  },
  {
    id: "him",
    name: "HIM",
    full: "[Full name of HIM]",
    area: "other",
    state: "active",
    status: "[Status]",
    group: true,
    featured: false,
    tagline: "[One-line description of HIM.]",
    tags: ["Group project"],
    problem: "[What problem does HIM address?]",
    approach: "[How does it work?]",
    build: "[How it is made: printed parts, materials, processes.]",
    role: "[Your contribution to the group project]",
    specs: [["[Spec]", "[Value]"]],
  },
  {
    id: "atobot",
    name: "ATOBOT",
    full: "Ankle and toe rehabilitation system",
    area: "lower",
    state: "active",
    status: "[Status]",
    group: true,
    featured: false,
    tagline: "A mechatronic system for ankle and toe rehabilitation.",
    tags: ["Lower limb", "Ankle", "Toe", "Group project"],
    problem: "[What problem does ATOBOT address?]",
    approach: "[How does it work?]",
    build: "[How it is made: printed parts, materials, processes.]",
    role: "[Your contribution to the group project]",
    specs: [["[Spec]", "[Value]"]],
  },
  {
    id: "finger-orthosis",
    name: "Finger Orthosis",
    full: "[Full name, if it has one]",
    area: "hand",
    state: "active",
    status: "[Status]",
    group: true,
    featured: false,
    tagline: "A finger orthosis. [Add a one-line description.]",
    tags: ["Hand", "Orthosis", "Group project"],
    problem: "[What problem does it address?]",
    approach: "[How does it work?]",
    build: "[How it is made: printed parts, materials, processes.]",
    role: "[Your contribution to the group project]",
    specs: [["[Spec]", "[Value]"]],
  },
];

/* ---------------------------------------------------------------------
   PUBLICATIONS AND PATENTS
   state for patents: granted | examination
   desc (optional) is a short plain-language note shown after the number
   --------------------------------------------------------------------- */
window.PAPERS = [
  { year: "2024", title: "Design and Control of Ball-and-Socket-Type Spherical Motor: A Comprehensive Study", authors: "Jasvinder Singh, R. K. Lishwanth, P. Akashraj, A. Maria Joseph Mervin, S. Aaron, V. Ananthashankar", venue: "Optimization of Production and Industrial Systems (CPIE 2023), Lecture Notes in Mechanical Engineering, Springer", link: "https://link.springer.com/chapter/10.1007/978-981-99-8343-8_8" },
  { year: "2023", title: "3D Printed Electronics: Role of Materials and Processes", authors: "P. Akashraj, A. Maria Joseph Mervin, Harjot Chane, R. K. Lishwanth, Md Ahsanul Habib Rahat, Panjul Garg, Vishal Francis, Narendra Kumar", venue: "Machining and Additive Manufacturing, Lecture Notes in Mechanical Engineering, Springer", link: "https://link.springer.com/chapter/10.1007/978-981-99-6094-1_4" },
];

window.PATENTS = [
  { state: "granted", title: "ATOBOT: An Apparatus for Assisting Ankle and Toe Movement of a Lower Limb", number: "Application no. 202541100905", year: "2025" },
  { state: "examination", title: "DYNABO: Modular Multi-Board Balance System with Rotational and Translational Perturbation Platform", number: "Application no. 202641102303", year: "2026" },
  { state: "examination", title: "Extruder System for Clog Detection", number: "Application no. 202541045947", desc: "IoT-based 3D printer fault detector", year: "2025" },
  { state: "examination", title: "A Vending Machine for Dispensing of Products", number: "Application no. 202441097227", desc: "Cartesian robot", year: "2024" },
  { state: "examination", title: "NOARK+: [Patent title]", number: "[Application no.]", year: "[Year]" },
];
