import type { TeamDepartment } from "@/types/teams.type"

const CLOUD_NAME = "dbxwgiqjr"

export function cloudinaryUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_400,c_fill,g_face/${publicId}`
}

export const TEAMS: Record<string, TeamDepartment> = {
  executive: {
    label: "Executive",
    description:
      "The Executive team oversees the organization's direction, planning, and overall coordination of MSC – NU Laguna.",
    members: [
      {
        name: "Carl Joshua E. Cabase",
        role: "President",
        facebookUrl: "https://www.facebook.com/cabasecj",
        linkedInUrl: "https://www.linkedin.com/in/cjcabase/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/cjerror404/",
      },
      {
        name: "Kyle Richard C. Sanchez",
        role: "Executive Vice President",
        facebookUrl: "https://www.facebook.com/kyle.richard.sanchez",
        linkedInUrl: "https://www.linkedin.com/in/kylesanchez0001",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/kylerichardsanchez-5214",
      },
      {
        name: "Keith Yves T. Robles",
        role: "Vice President for Technology",
        facebookUrl: "https://www.facebook.com/sonic.keith/",
        linkedInUrl: "https://www.linkedin.com/in/keithrobles/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/keithyvesrobles-7266/",
      },
      {
        name: "Rechel Ann R. Belen",
        role: "Vice President for Operations",
        facebookUrl: "https://www.facebook.com/stobewei/",
        linkedInUrl: "https://www.linkedin.com/in/rechel-ann-belen-59057a27a",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/rechelbelen-5840/",
      },
      {
        name: "Juliane Nicole P. Caballes",
        role: "Vice President for Community Development",
        facebookUrl: "https://www.facebook.com/juliane.caballes",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/caballesjulianenicole-5666/",
      },
      {
        name: "Franco Martin C. Ibeas",
        role: "Vice President for Communications",
        facebookUrl: "https://www.facebook.com/frncmrtn/",
        linkedInUrl: "https://www.linkedin.com/in/franco-martin-ibeas-278649191",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/ibeasfrancomartin-7383/",
      },
      {
        name: "Carla Marie M. Lipa",
        role: "Vice President for Strategic Partnerships",
        facebookUrl: "https://www.facebook.com/share/1FJVcZijob/",
        linkedInUrl: "https://www.linkedin.com/in/carla-marie-lipa-02bb36278",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/lipacarlamarie-0107/",
      },
      {
        name: "Nicole S. Quilang",
        role: "Vice President for Finance",
        facebookUrl: "https://www.facebook.com/nclqlng",
        linkedInUrl: "https://www.linkedin.com/in/nicole-quilang/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/quilangnicole-9866/credentials",
      },
    ],
  },
  technology: {
    label: "Technology",
    description:
      "The Technology team builds and maintains tools, supports events, and helps members grow through hands-on technical work.",
    members: [
      {
        name: "Keith Yves T. Robles",
        role: "Vice President for Technology",
        facebookUrl: "https://www.facebook.com/sonic.keith/",
        linkedInUrl: "https://www.linkedin.com/in/keithrobles/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/keithyvesrobles-7266/",
      },
      {
        name: "Noe Railey S. Vierneza",
        role: "Training and Development Lead",
        facebookUrl: "https://www.facebook.com/rai.vierneza/",
        linkedInUrl: "https://www.linkedin.com/in/rai-vierneza/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/viernezanoeraileys-4981/",
      },
      {
        name: "Sarah Beatrice R. Realubit",
        role: "UI/UX Lead",
        facebookUrl: "https://www.facebook.com/sbrealubit",
        linkedInUrl: "https://www.linkedin.com/in/sarah-beatrice-realubit/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/sbrrealubit/",
      },
      {
        name: "Paul Andrei G. Datinguinoo",
        role: "AI/ML Lead",
        facebookUrl: "https://www.facebook.com/share/178rxUK41y/?mibextid=wwXIfr",
        linkedInUrl: "https://www.linkedin.com/in/paul-andrei-datinguinoo-05b779317",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/datinguinoopaulandrei-6911/",
      },
      {
        name: "Mark Lorenz T. Aguilar",
        role: "RPA Lead",
        facebookUrl: "https://www.facebook.com/mark.aguilar23/",
        linkedInUrl: "https://www.linkedin.com/in/mark-lorenz-aguilar/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/aguilarmarklorenz-0563/",
      },
      {
        name: "Eirol John S. Nepomuceno",
        role: "Cybersecurity Lead",
        facebookUrl: "https://www.facebook.com/eyeeeyrol/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/nepoeirolj/",
      },
      {
        name: "Merwin M. Generoso",
        role: "Web Development Lead",
        facebookUrl: "https://www.facebook.com/eroedtx/",
        linkedInUrl: "https://www.linkedin.com/in/generosomm/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/generosomerwin-8251/",
      },
      {
        name: "Lashawn Railey H. Diaz",
        role: "Web Development Lead",
        facebookUrl: "https://www.facebook.com/share/1CGQTGwVpK/?mibextid=wwXIfr",
        linkedInUrl: "https://www.linkedin.com/in/lashawn-railey-diaz-3678a31a5",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/diazlashawnrailey-2248/",
      },
      {
        name: "Zedryl Hershey B. Corales",
        role: "Digital Manager",
        facebookUrl: "https://www.facebook.com/share/16xPWTnfE6/?mibextid=wwXIfr",
        linkedInUrl: "https://www.linkedin.com/in/zedryl-hershey-corales-b254a1361",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/zedrylhersheycorales-5046/",
      },
      {
        name: "Byron Caesar A. Capulong",
        role: "Platform Moderator",
        facebookUrl: "https://www.facebook.com/byrs.capulong",
        linkedInUrl: "https://www.linkedin.com/in/byron-capulong-928b41383/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/ByronCapulong",
      },
      {
        name: "Mohammad A. Balmeh",
        role: "Platform Moderator",
        facebookUrl: "https://www.facebook.com/mohammad.balmeh",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/balmehmohammad-7586/",
      },
      {
        name: "Christian V. De Ocampo",
        role: "Platform Moderator",
        facebookUrl: "https://www.facebook.com/itsjust.xtian",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/deocampochristian-0914/",
      },
      {
        name: "Charles Andrew Taripe",
        role: "Learning and Quality Monitoring Officer",
        facebookUrl: "https://www.facebook.com/charleztaripe/",
        linkedInUrl: "https://www.linkedin.com/in/charles-andrew-taripe-64ab8937a/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/me/",
      },
    ],
  },
  operations: {
    label: "Operations",
    description:
      "The Operations team manages event logistics, technical support, and day-to-day execution to keep MSC – NU Laguna running smoothly.",
    members: [
      {
        name: "Rechel Ann R. Belen",
        role: "Vice President for Operations",
        facebookUrl: "https://www.facebook.com/stobewei/",
        linkedInUrl: "https://www.linkedin.com/in/rechel-ann-belen-59057a27a",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/rechelbelen-5840/",
      },
      {
        name: "Nigella Georcelle M. Bravo",
        role: "Events Director",
        facebookUrl: "https://www.facebook.com/nigella.bravo/",
        linkedInUrl: "https://www.linkedin.com/in/bravonigella/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/ellebravo/",
      },
      {
        name: "John Owen Remojo",
        role: "Event Analyst",
        facebookUrl: "https://www.facebook.com/owen.remojo.3/",
        linkedInUrl: "https://www.linkedin.com/in/owenuchiremojo/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/owenuchiremojo-3299/",
      },
      {
        name: "Jhen Franchesca V. Abarquez",
        role: "Event Analyst",
        facebookUrl: "https://www.facebook.com/share/19LERGKsU5/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/abarquezjhenfranchescav-0721/",
      },
      {
        name: "Ysabelle E. Estabaya",
        role: "Logistics Lead",
        facebookUrl: "https://www.facebook.com/adorkablesos/",
        linkedInUrl: "https://www.linkedin.com/in/ysabelle-estabaya-0b8182384/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/me/settings",
      },
      {
        name: "Iya Marie A. Malinao",
        role: "Logistics Officer",
        facebookUrl: "https://www.facebook.com/malinao.iyamarie/",
        linkedInUrl: "https://www.linkedin.com/in/iyamarie-malinao/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/malinaoiyamariea-7210/",
      },
      {
        name: "Justine Kyle O. Resureccion",
        role: "Logistics Officer",
        facebookUrl: "https://www.facebook.com/justine.resureccion.2024",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/resureccionjustinekyleo-8579/",
      },
      {
        name: "Bien Manuel P. Badosa",
        role: "Logistics Officer",
        facebookUrl: "https://www.facebook.com/bienmanuelbadosa/",
        linkedInUrl: "https://www.linkedin.com/in/bien-manuel-badosa-803932367",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/me/settings",
      },
      {
        name: "John Frederick D. Santiago",
        role: "Logistics Officer",
        facebookUrl: "https://www.facebook.com/freddy.santiFB/",
        linkedInUrl: "https://www.linkedin.com/in/john-frederick-santiago-5b0a09323/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/santiagojohnfrederickd-6584/",
      },
      {
        name: "Khylle Jefferson G. Dinero",
        role: "Technical Support Lead",
        facebookUrl: "https://www.facebook.com/share/1BLMuXonpS/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/khylle707/",
      },
      {
        name: "Gabriel B. Elepaño",
        role: "Technical Support Officer",
        facebookUrl: "https://www.facebook.com/gbgbgbrl",
        linkedInUrl: "https://www.linkedin.com/in/gabrielelepano/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/gabrielelepao-1377/",
      },
      {
        name: "Amir L. Wagas",
        role: "Technical Support Officer",
        facebookUrl: "https://www.facebook.com/akongasiamirLwagas",
        linkedInUrl: "https://www.linkedin.com/in/amir-wagas-098548329/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/wagasamirl-8821/",
      },
      {
        name: "Carl Angelo L. Mercado",
        role: "Technical Support Officer",
        facebookUrl: "https://www.facebook.com/Aishifishyy/",
        linkedInUrl: "https://www.linkedin.com/in/mercadocl/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/aishifishy/",
      },
      {
        name: "Merwin A. Paner",
        role: "Technical Support Officer",
        facebookUrl: "https://www.facebook.com/merwin.paner",
        linkedInUrl: "https://www.linkedin.com/in/merwinpaner",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/wino-4585",
      },
    ],
  },
  communications: {
    label: "Communications",
    description:
      "The Communications team handles marketing, creative content, media production, and documentation for MSC – NU Laguna.",
    members: [
      {
        name: "Franco Martin C. Ibeas",
        role: "Vice President for Communications",
        facebookUrl: "https://www.facebook.com/frncmrtn/",
        linkedInUrl: "https://www.linkedin.com/in/franco-martin-ibeas-278649191",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/ibeasfrancomartin-7383/",
      },
      {
        name: "Laura Patricia Isabelle F. Quiling",
        role: "Marketing Lead",
        facebookUrl: "https://www.facebook.com/yshabelle.quiling/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/quilinglaurapatriciaisabelle-9908/",
      },
      {
        name: "Yexel Kurt R. Bides",
        role: "Marketing Officer",
        facebookUrl: "https://www.facebook.com/yexel.bides/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/bidesyexelkurt-3113/",
      },
      {
        name: "Ericka Jones D. Morris",
        role: "Marketing Officer",
        facebookUrl: "https://www.facebook.com/share/174g4wri3S/?mibextid=wwXIfr",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/collections/w4wwhztexr0men?sharingId=studentamb_221982",
      },
      {
        name: "Jemina Abellano",
        role: "Visual Design Lead",
        facebookUrl: "https://www.facebook.com/jaemina0331",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/abellanojemina-2166/",
      },
      {
        name: "Joseff Czar C. Cortez",
        role: "Creative Officer",
        facebookUrl: "https://www.facebook.com/joseff.cortez.2024/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/joseffczarccortez-0957/",
      },
      {
        name: "Ralp Irvin B. Magnaye",
        role: "Creative Officer",
        facebookUrl: "https://www.facebook.com/ralp.i.magnaye/",
        linkedInUrl: "https://www.linkedin.com/in/ralp-irvin-magnaye-499796274/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/magnayeralpirvinb-2425/",
      },
      {
        name: "Therese Joie C. Rendal",
        role: "Creative Officer",
        facebookUrl: "https://www.facebook.com/theresejoie.cortez/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/theresejoierendal-4461/",
      },
      {
        name: "Donna L. Rodriguez",
        role: "Creative Officer",
        facebookUrl: "https://www.facebook.com/n4narie",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/me/?tab=tab-modules",
      },
      {
        name: "Kyle Matthew B. De Mesa",
        role: "Creative Officer",
        facebookUrl: "https://www.facebook.com/dmky1e/",
        linkedInUrl: "https://www.linkedin.com/in/kyledemesa/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/demesakylematthew-4044/",
      },
      {
        name: "Margaret R. Castillo",
        role: "Media Production Lead",
        facebookUrl: "https://www.facebook.com/share/19ZcHLQCAv/?mibextid=wwXIfr",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/castillomargaret-1192/",
      },
      {
        name: "Cyril Kaye P. Ortiz",
        role: "Documentation Officer",
        facebookUrl: "https://www.facebook.com/share/178gvjHUcE/",
        linkedInUrl: "https://www.linkedin.com/in/cyril-ortiz",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/ortizcyrilkayep-4552/",
      },
      {
        name: "Ramgideon Q. Lorzano",
        role: "Documentation Officer",
        facebookUrl: "https://www.facebook.com/rgn.lrzno/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/lorzanoramgideon-9308/",
      },
      {
        name: "Margaret Nicole E. Putungan",
        role: "Documentation Officer",
        facebookUrl: "https://www.facebook.com/nikoluhhhh/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/putunganmargaretnicole-1308/",
      },
    ],
  },
  communityDevelopment: {
    label: "Community Development",
    description:
      "The Community Development team focuses on member engagement, social good initiatives, and building an inclusive community within MSC – NU Laguna.",
    members: [
      {
        name: "Juliane Nicole P. Caballes",
        role: "Vice President for Community Development",
        facebookUrl: "https://www.facebook.com/juliane.caballes",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/caballesjulianenicole-5666/",
      },
      {
        name: "Matthew Clarence S. Jompilla",
        role: "Engagement Lead",
        facebookUrl: "https://www.facebook.com/matthew.jompilla/",
        linkedInUrl: "https://www.linkedin.com/in/matthewclarencejompilla/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/jompillamatthewclarence-5011/",
      },
      {
        name: "Ishiemitch N. Laurel",
        role: "Social Good Lead",
        facebookUrl: "https://www.facebook.com/ishiemitchnuestro",
        linkedInUrl: "https://www.linkedin.com/in/ishiemitch",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/ishiemitchlaurel-4344",
      },
      {
        name: "John Simon Ray C. Umadac",
        role: "Membership Lead",
        facebookUrl: "https://www.facebook.com/simyownn/",
        linkedInUrl: "https://www.linkedin.com/in/john-simon-ray-umadac-410839328/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/umadacjohnsimonray-2761/",
      },
      {
        name: "Adrienne Ghabriel Xander Pagaran",
        role: "Membership Officer",
        facebookUrl: "https://www.facebook.com/agxp930/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/me/#account-linking",
      },
      {
        name: "Giecelyn Mae T. Articona",
        role: "Engagement Officer",
        facebookUrl: "https://www.facebook.com/profile.php?id=100012205875419",
        microsoftLearnUrl: "https://learn.microsoft.com/en-gb/users/giecelynarticona-1983/",
      },
    ],
  },
  finance: {
    label: "Finance",
    description:
      "The Finance team manages the organization's budget, procurement, and financial planning.",
    members: [
      {
        name: "Nicole S. Quilang",
        role: "Vice President for Finance",
        facebookUrl: "https://www.facebook.com/nclqlng",
        linkedInUrl: "https://www.linkedin.com/in/nicole-quilang/",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/quilangnicole-9866/credentials",
      },
      {
        name: "Princess Patricia Ann D. Cariño",
        role: "Finance Lead",
        facebookUrl: "https://www.facebook.com/share/14HHstWESGR/",
        linkedInUrl: "https://www.linkedin.com/in/princess-patricia-ann-cari%C3%B1o-65278a325",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/princesspatriciaanncario-0152/",
      },
      {
        name: "Andy P. Obsanga",
        role: "Procurement Lead",
        facebookUrl: "https://www.facebook.com/share/1BN27bpi4v/?mibextid=wwXIfr",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/obsangaandy-3343/",
      },
    ],
  },
  audit: {
    label: "Audit",
    description:
      "The Audit team ensures accountability and transparency across all organizational activities.",
    members: [
      {
        name: "Markwin Angelo M. Gutierrez",
        role: "Lead Auditor",
        facebookUrl: "https://www.facebook.com/gtrrzmrkwn",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/gutierrezmarkwinangelom-5413/",
      },
      {
        name: "Rose Vien Sanchez",
        role: "Auditor",
        facebookUrl: "https://www.facebook.com/share/1CU9qEzjBN/?mibextid=wwXIfr",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/sanchezrosevien-6691/",
      },
      {
        name: "Charmaine Kae M. Rodriguez",
        role: "Auditor",
        facebookUrl: "https://www.facebook.com/chrmnrdrgz",
        linkedInUrl: "https://www.linkedin.com/in/charmaine-kae-rodriguez",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/rodriguezcharmainekaem-4720/",
      },
    ],
  },
  partners: {
    label: "Strategic Partnerships",
    description:
      "The Strategic Partnerships team collaborates with partners and sponsors to create opportunities, resources, and impactful events.",
    members: [
      {
        name: "Carla Marie M. Lipa",
        role: "Vice President for Strategic Partnerships",
        facebookUrl: "https://www.facebook.com/share/1FJVcZijob/",
        linkedInUrl: "https://www.linkedin.com/in/carla-marie-lipa-02bb36278",
        microsoftLearnUrl: "https://learn.microsoft.com/en-us/users/lipacarlamarie-0107/",
      },
    ],
  },
}