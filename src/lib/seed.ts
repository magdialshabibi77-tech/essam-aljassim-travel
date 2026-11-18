import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  adminUsers,
  benefits,
  busCompanies,
  busRoutes,
  faqs,
  homeSections,
  offers,
  services,
  siteSettings,
  stats,
  testimonials,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";

const IMG = {
  hero: "https://images.pexels.com/photos/34956775/pexels-photo-34956775.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1900",
  umrah: "https://images.pexels.com/photos/5620451/pexels-photo-a-crowd-on-a-square-in-mecca-5620451.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  madinah: "https://images.pexels.com/photos/38498729/pexels-photo-38498729.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  riyadh: "https://images.pexels.com/photos/35761/pexels-photo.jpg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  riyadhNight:
    "https://images.pexels.com/photos/39470846/pexels-photo-39470846.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  plane: "https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  airport: "https://images.pexels.com/photos/38778476/pexels-photo-38778476.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  bus1: "https://images.pexels.com/photos/29586609/pexels-photo-29586609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  bus2: "https://images.pexels.com/photos/34612274/pexels-photo-34612274.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  bus3: "https://images.pexels.com/photos/40919466/pexels-photo-40919466.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  passport:
    "https://images.pexels.com/photos/39356223/pexels-photo-39356223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  yemen: "https://images.pexels.com/photos/14025188/pexels-photo-14025188.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
};

const POPUP_MESSAGE =
  "أهلاً بك في مكتب عصام الجسيم للسفريات والسياحة ✈️\nهل تحتاج مساعدة في حجز رحلة أو تأشيرة أو عمرة أو حجز باص؟\nتواصل معنا الآن، وسنكون سعداء بخدمتك.";

const DEFAULT_SETTINGS = {
  id: 1,
  officeName: "مكتب عصام الجسيم للسفريات والسياحة",
  officeShortName: "عصام الجسيم",
  tagline: "للسفريات والسياحة",
  phone: "+967 781 808 012",
  whatsappNumber: "967781808012",
  whatsappLink: "https://wa.me/967781808012",
  address: "إب - فرزة الدليل - شارع صنعاء القديم - أمام صرافة عصام الجسيم - اليمن",
  mapsLink: "https://maps.app.goo.gl/BPRWLCdunVYsYCuG9",
  facebookUrl: "https://www.facebook.com/share/1FTqMpeTib/",
  tiktokUrl: "https://www.tiktok.com/@essam_028",
  workingHours: "السبت - الخميس: 8:00 صباحاً - 9:00 مساءً",
  workingHoursNote: "الجمعة: من بعد صلاة الجمعة حتى 8:00 مساءً",
  availabilityStatus: "open",
  aboutText:
    "مكتب عصام الجسيم للسفريات والسياحة — نقدم خدمات السفر والحجوزات ومتابعة معاملات التأشيرات وبرامج الحج والعمرة، لتكون رحلتك أكثر سهولة وراحة.",
  colorPrimary: "#0b3f52",
  colorNavy: "#0a2540",
  colorAccent: "#c9a227",
  colorBackground: "#faf7f0",
  colorSurface: "#ffffff",
  seoTitle:
    "مكتب عصام الجسيم للسفريات والسياحة | إب - تأشيرات وتذاكر طيران وعمرة وحجوزات باصات",
  seoDescription:
    "مكتب عصام الجسيم للسفريات والسياحة في إب - فرزة الدليل، شارع صنعاء القديم. خدمات تأشيرات المملكة والزيارات، حجز تذاكر الطيران، برامج الحج والعمرة، وحجوزات الباصات. تواصل عبر واتساب 967781808012.",
  seoKeywords:
    "مكتب عصام الجسيم للسفريات, مكتب عصام الجسيم للسفريات والسياحة إب, حجوزات باصات في إب, حجز تذاكر طيران في إب, تأشيرات عمرة في إب, مكاتب سفريات في إب, تأشيرات زيارة عائلية, برامج عمرة",
  whatsappPopupEnabled: true,
  whatsappPopupTitle: "نسعد بخدمتك ✈️",
  whatsappPopupMessage: POPUP_MESSAGE,
  whatsappPopupButton: "تحدث معنا عبر واتساب",
  whatsappPopupDelay: 12000,
  copyrightText: "جميع الحقوق محفوظة — مكتب عصام الجسيم للسفريات والسياحة",
  footerNote: "طلب الحجز يخضع لمراجعة المكتب والتأكد من التوفر قبل التأكيد النهائي.",
};

const DEFAULT_SECTIONS = [
  {
    key: "hero",
    label: "الواجهة الرئيسية",
    title: "رحلتك تبدأ من هنا... وخدمات السفر بين يديك",
    subtitle: "مكتب عصام الجسيم للسفريات والسياحة",
    description:
      "مكتب عصام الجسيم للسفريات والسياحة، نقدم خدمات السفر والحجوزات ومتابعة معاملات التأشيرات وبرامج الحج والعمرة، لتكون رحلتك أكثر سهولة وراحة.",
    imageUrl: IMG.hero,
    sortOrder: 1,
  },
  {
    key: "services",
    label: "الخدمات الرئيسية",
    title: "خدماتنا الرئيسية",
    subtitle: "كل ما تحتاجه لرحلتك في مكان واحد",
    description: "نرافقك من أول استفسار حتى إتمام رحلتك، بخدمة مباشرة ومتابعة شخصية.",
    sortOrder: 2,
  },
  {
    key: "offers",
    label: "العروض والبرامج",
    title: "عروض وبرامج السفر",
    subtitle: "برامج مختارة يوفرها المكتب حسب الموسم والطلب",
    description: "الأسعار والمواعيد تتأكد من المكتب مباشرة عند التواصل.",
    sortOrder: 3,
  },
  {
    key: "buses",
    label: "حجوزات الباصات",
    title: "حجز تذاكر الباصات",
    subtitle: "شركات النقل البري بين المدن اليمنية والسعودية",
    description: "اختر الشركة والمدن وتاريخ السفر، وأرسل طلب الحجز لنتحقق من التوفر.",
    sortOrder: 4,
  },
  {
    key: "benefits",
    label: "لماذا تختارنا",
    title: "لماذا تختار مكتب عصام الجسيم؟",
    subtitle: "ثقة تُبنى على الخدمة الحقيقية",
    description: "خدمة مباشرة من المكتب، ومتابعة لحالة طلبك حتى النهاية.",
    sortOrder: 5,
  },
  {
    key: "testimonials",
    label: "آراء العملاء",
    title: "آراء العملاء",
    subtitle: "تجارب حقيقية يشاركها عملاؤنا",
    description: "لا نعرض أي تقييم إلا بعد إدخاله وتأكيده من إدارة المكتب.",
    sortOrder: 6,
  },
  {
    key: "stats",
    label: "أرقام ومعلومات سريعة",
    title: "معلومات سريعة",
    subtitle: "",
    description: "",
    sortOrder: 7,
  },
  {
    key: "faq",
    label: "الأسئلة الشائعة",
    title: "الأسئلة الشائعة",
    subtitle: "إجابات واضحة على أكثر ما يسأل عنه عملاؤنا",
    description: "",
    sortOrder: 8,
  },
  {
    key: "contact",
    label: "موقع المكتب والخريطة",
    title: "موقع المكتب والخريطة",
    subtitle: "نستقبلك في مقر المكتب في إب",
    description:
      "إب - فرزة الدليل - شارع صنعاء القديم - أمام صرافة عصام الجسيم - اليمن",
    sortOrder: 9,
  },
  {
    key: "cta",
    label: "دعوة التواصل النهائية",
    title: "جاهز لترتيب رحلتك؟",
    subtitle: "تواصل معنا الآن وسنبدأ معك الخطوات",
    description: "اتصل بنا أو أرسل رسالة واتساب، وسيتولى فريق المكتب متابعة طلبك.",
    sortOrder: 10,
  },
];

const DEFAULT_SERVICES = [
  {
    slug: "hajj-umrah",
    title: "الحج والعمرة",
    shortDescription:
      "برامج العمرة وخدمات الحج مع متابعة كاملة للتأشيرات والمواعيد والتكاليف.",
    description:
      "يوفر المكتب خدمات الحج والعمرة من خلال متابعة التأشيرات وتنظيم البرامج مع الجهات المعتمدة. نستقبل استفساراتك عن المواعيد والتكاليف وتفاصيل البرنامج، ثم نراجع الطلب ونتواصل معك لتأكيد التفاصيل قبل أي حجز.",
    icon: "mosque",
    imageUrl: IMG.umrah,
    features: [
      "برامج العمرة الموسمية",
      "خدمات الحج والاستفسار عن البرامج",
      "تأشيرات العمرة",
      "الاستفسار عن المواعيد والتكاليف",
      "إرسال طلب حجز أو استفسار",
    ],
    sortOrder: 1,
  },
  {
    slug: "saudi-visas",
    title: "تأشيرات المملكة والزيارات",
    shortDescription:
      "تجهيز ومتابعة معاملات تأشيرات الزيارة والعمل والعلاج والدراسة بحسب المتطلبات الرسمية.",
    description:
      "نتولى تجهيز ومتابعة معاملات التأشيرات بحسب المتطلبات الرسمية المحددة لكل نوع، مع توضيح المستندات المطلوبة والمدة المتوقعة. تتم مشاركة المستندات عبر القنوات الآمنة المعتمدة من المكتب، ويتم إبلاغك بمراحل المعاملة عند كل خطوة.",
    icon: "passport",
    imageUrl: IMG.riyadh,
    features: [
      "تأشيرات الزيارة العائلية",
      "تأشيرات العمل",
      "تأشيرات العلاج",
      "تأشيرات الدراسة",
      "متابعة وتجهيز المعاملات بحسب المتطلبات الرسمية",
    ],
    sortOrder: 2,
  },
  {
    slug: "flight-tickets",
    title: "تذاكر الطيران",
    shortDescription:
      "حجز تذاكر الطيران والاستفسار عن الرحلات واختيار الوجهة وتاريخ السفر.",
    description:
      "نساعدك في تحديد الوجهة وتاريخ السفر ثم نستفسر عن الخيارات المتاحة وأسعارها من مكاتب البيع المعتمدة. لا يتم إصدار التذكرة إلا بعد تأكيدك للخيار والتأكد من التوفر والدفع.",
    icon: "plane",
    imageUrl: IMG.plane,
    features: [
      "حجز تذاكر الطيران",
      "الاستفسار عن الرحلات",
      "تحديد الوجهة",
      "اختيار تاريخ السفر",
      "إرسال طلب الحجز عبر واتساب",
    ],
    sortOrder: 3,
  },
  {
    slug: "bus-booking",
    title: "حجوزات الباصات",
    shortDescription:
      "حجز تذاكر الباصات بين المدن مع شركات النقل البري المعروفة، ومراجعة التوفر من المكتب.",
    description:
      "نستقبل طلبات حجز الباصات مع تحديد مدينة الانطلاق والمدينة المطلوبة والشركة المفضلة وتاريخ السفر وعدد المسافرين. بعد استلام الطلب يتحقق المكتب من التوفر والمواعيد لدى شركة النقل ثم يتواصل معك للتأكيد النهائي.",
    icon: "bus",
    imageUrl: IMG.bus1,
    features: [
      "شركات نقل بري متعددة",
      "تحديد مدينة الانطلاق والوصول",
      "اختيار تاريخ السفر وعدد المسافرين",
      "مراجعة التوفر قبل التأكيد",
      "متابعة الطلب من لوحة المكتب",
    ],
    sortOrder: 4,
  },
];

const DEFAULT_OFFERS = [
  {
    slug: "umrah-programs",
    title: "برامج العمرة",
    category: "برامج العمرة",
    summary:
      "برامج عمرة بمواسم متعددة تشمل التأشيرة والإقامة والتنقلات، تُحدد تفاصيلها حسب الموسم والميزانية.",
    details:
      "يشمل البرنامج التأشيرة والإقامة قرب الحرم والتنقلات بين مكة والمدينة، ويتم ترتيب التفاصيل النهائية بعد التواصل مع المكتب ومعرفة الموسم وعدد المسافرين ومدة الإقامة. تواصل معنا لمعرفة الأسعار المتوفرة حالياً.",
    imageUrl: IMG.madinah,
    sortOrder: 1,
  },
  {
    slug: "flight-ticket-offers",
    title: "عروض تذاكر الطيران",
    category: "تذاكر طيران",
    summary:
      "خيارات تذاكر متغيرة حسب الوجهة وتاريخ السفر، نستفسر عنها فوراً عند طلبك ونرسل لك المتاح.",
    details:
      "أرسل الوجهة وتاريخ السفر وعدد المسافرين، وسيقوم المكتب بالاستفسار عن الخيارات المتاحة وأسعارها وإرسالها لك عبر واتساب قبل أي حجز. الأسعار تتغير حسب وقت الحجز وتوفر المقاعد.",
    imageUrl: IMG.airport,
    sortOrder: 2,
  },
  {
    slug: "family-visit-programs",
    title: "برامج الزيارة العائلية",
    category: "برامج الزيارة",
    summary:
      "متابعة تأشيرات الزيارة العائلية مع توضيح المستندات المطلوبة لكل فرد من أفراد الأسرة.",
    details:
      "نساعدك في تجهيز معاملة تأشيرة الزيارة العائلية وتوضيح المستندات المطلوبة لكل فرد، ونوافيك بمراحل المعاملة حتى صدورها. المستندات تُشارك عبر القنوات الآمنة المعتمدة من المكتب.",
    imageUrl: IMG.riyadhNight,
    sortOrder: 3,
  },
  {
    slug: "additional-services",
    title: "خدمات إضافية يقدمها المكتب",
    category: "خدمات إضافية",
    summary:
      "خدمات مساندة تشمل الاستشارة في خطط السفر وتنسيق الموعد مع الجهات المختصة.",
    details:
      "بالإضافة إلى الخدمات الرئيسية، يوفر المكتب استشارات لتنظيم خطة السفر وترتيب أولويات المعاملات وتنسيق الموعد مع الجهات المختصة. اتصل بنا للاستفسار عن أي خدمة إضافية.",
    imageUrl: IMG.passport,
    sortOrder: 4,
  },
];

const DEFAULT_COMPANIES = [
  {
    name: "شركة البركة للنقل",
    slug: "albaraka",
    description:
      "شركة نقل بري تعمل على خطوط بين المدن اليمنية والسعودية، وتُستقبل طلبات الحجز الخاصة بها عبر المكتب.",
    routeSummary: "إب - صنعاء - الحديدة - جدة - مكة",
    cities: ["إب", "صنعاء", "الحديدة", "تعز", "جدة", "مكة المكرمة"],
    coverUrl: IMG.bus2,
    contactInfo: "يتم التواصل مع الشركة من خلال المكتب بعد مراجعة الطلب.",
    availability: "available",
    sortOrder: 1,
  },
  {
    name: "شركة المتصدر للنقل",
    slug: "almutasaddir",
    description:
      "شركة نقل بري تقدم رحلات بين المدن اليمنية، ويتم التحقق من المواعيد والتوفر لدى الشركة قبل تأكيد أي حجز.",
    routeSummary: "إب - صنعاء - عدن - جدة",
    cities: ["إب", "صنعاء", "عدن", "تعز", "جدة"],
    coverUrl: IMG.bus3,
    contactInfo: "يتم التواصل مع الشركة من خلال المكتب بعد مراجعة الطلب.",
    availability: "available",
    sortOrder: 2,
  },
  {
    name: "شركات نقل أخرى",
    slug: "other-companies",
    description:
      "يمكن للمكتب مراجعة خيارات أخرى لشركات النقل حسب الطلب والتوفر. أضف الشركات الجديدة من لوحة التحكم عند تأكيدها.",
    routeSummary: "خطوط سير متعددة حسب الشركة",
    cities: ["إب", "صنعاء", "عدن", "الحديدة", "جدة", "الرياض"],
    coverUrl: IMG.bus1,
    contactInfo: "اتصل بالمكتب للاستفسار عن الخيارات المتاحة.",
    availability: "limited",
    sortOrder: 3,
  },
];

const DEFAULT_ROUTES = [
  { companyName: "شركة البركة للنقل", origin: "إب", destination: "جدة", departureInfo: "حسب جدول الشركة", priceInfo: "", notes: "يتم تأكيد الموعد بعد التحقق من التوفر." },
  { companyName: "شركة البركة للنقل", origin: "صنعاء", destination: "مكة المكرمة", departureInfo: "حسب جدول الشركة", priceInfo: "", notes: "يتم تأكيد الموعد بعد التحقق من التوفر." },
  { companyName: "شركة المتصدر للنقل", origin: "إب", destination: "جدة", departureInfo: "حسب جدول الشركة", priceInfo: "", notes: "يتم تأكيد الموعد بعد التحقق من التوفر." },
  { companyName: "شركة المتصدر للنقل", origin: "إب", destination: "صنعاء", departureInfo: "حسب جدول الشركة", priceInfo: "", notes: "يتم تأكيد الموعد بعد التحقق من التوفر." },
];

const DEFAULT_FAQS = [
  {
    question: "هل يُعد الطلب المرسل عبر الموقع حجزاً مؤكداً؟",
    answer:
      "لا. الطلب المرسل عبر الموقع هو طلب حجز أو استفسار يُراجعه المكتب ويتم التأكيد النهائي بعد التحقق من التوفر والتواصل معك هاتفياً أو عبر واتساب.",
    sortOrder: 1,
  },
  {
    question: "كيف أرسل طلب حجز باص؟",
    answer:
      "من صفحة حجوزات الباصات، املأ نموذج الطلب (الاسم، رقم الهاتف، مدينة الانطلاق، المدينة المطلوبة، الشركة المفضلة، تاريخ السفر، عدد المسافرين). بعد الإرسال يُحفظ الطلب لدى المكتب ويُفتح واتساب برسالة جاهزة تحتوي بيانات الطلب.",
    sortOrder: 2,
  },
  {
    question: "ما المستندات المطلوبة للتأشيرات؟",
    answer:
      "تختلف المستندات بحسب نوع التأشيرة (زيارة عائلية، عمل، علاج، دراسة). بعد إرسال استفسارك يوضح لك المكتب قائمة المستندات المطلوبة لحالتك، وتتم مشاركة المستندات عبر القنوات الآمنة المعتمدة من المكتب.",
    sortOrder: 3,
  },
  {
    question: "كيف أعرف سعر برنامج العمرة أو تذكرة الطيران؟",
    answer:
      "الأسعار تتغير بحسب الموسم والتوفر وتاريخ السفر، لذلك لا نعرض أسعاراً ثابتة في الموقع. تواصل معنا وسيتم إرسال الأسعار المتوفرة لحالتك بدقة.",
    sortOrder: 4,
  },
  {
    question: "ما هي أوقات العمل ومقر المكتب؟",
    answer:
      "المقر: إب - فرزة الدليل - شارع صنعاء القديم - أمام صرافة عصام الجسيم - اليمن. أوقات العمل معروضة في أعلى الموقع وتتحدّث من لوحة التحكم، ويمكنك التواصل عبر واتساب في أي وقت.",
    sortOrder: 5,
  },
  {
    question: "هل يمكنني إرسال طلب من خارج إب؟",
    answer:
      "نعم، نستقبل الطلبات من إب والمحافظات المجاورة، وتتم المتابعة معك هاتفياً أو عبر واتساب حتى إتمام الخدمة.",
    sortOrder: 6,
  },
];

const DEFAULT_BENEFITS = [
  {
    title: "متابعة شخصية لطلبك",
    description: "كل طلب يُسجل في نظام المكتب ويُتابع حتى الوصول إلى النتيجة النهائية.",
    icon: "user",
    sortOrder: 1,
  },
  {
    title: "شفافية في المعلومات",
    description: "لا نعرض أسعاراً ولا مواعيد غير مؤكدة، ونرسل لك التفاصيل المتاحة بدقة.",
    icon: "shield",
    sortOrder: 2,
  },
  {
    title: "تأكيد الحجز بعد المراجعة",
    description: "يُراجع المكتب الطلب ويتحقق من التوفر لدى الجهة المعتمدة قبل التأكيد.",
    icon: "check",
    sortOrder: 3,
  },
  {
    title: "تواصل سريع عبر واتساب",
    description: "قناة تواصل مباشرة تتيح لك إرسال الطلب واستقبال التحديثات بسهولة.",
    icon: "chat",
    sortOrder: 4,
  },
  {
    title: "خبرة في معاملات التأشيرات",
    description: "متابعة معاملات التأشيرات بحسب المتطلبات الرسمية لكل نوع.",
    icon: "passport",
    sortOrder: 5,
  },
  {
    title: "خدمة موثوقة من إب",
    description: "مقر المكتب في إب - فرزة الدليل، وخدمة للعملاء من المحافظات المجاورة.",
    icon: "pin",
    sortOrder: 6,
  },
];

const DEFAULT_STATS = [
  { value: "4", label: "خدمات رئيسية", sortOrder: 1 },
  { value: "إب", label: "مقر المكتب", sortOrder: 2 },
  { value: "المحافظات", label: "نستقبل الطلبات من", sortOrder: 3 },
  { value: "واتساب", label: "أسرع قناة تواصل", sortOrder: 4 },
];

function slugify(input: string, fallback: string) {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base || fallback;
}

let bootstrapPromise: Promise<void> | null = null;

async function runBootstrap() {
  // إعدادات الموقع
  const settingsRow = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
  if (settingsRow.length === 0) {
    await db.insert(siteSettings).values(DEFAULT_SETTINGS).onConflictDoNothing();
  }

  // أقسام الصفحة الرئيسية
  const sectionRows = await db.select({ key: homeSections.key }).from(homeSections).limit(1);
  if (sectionRows.length === 0) {
    await db.insert(homeSections).values(DEFAULT_SECTIONS).onConflictDoNothing();
  }

  // الخدمات
  const serviceRows = await db.select({ id: services.id }).from(services).limit(1);
  if (serviceRows.length === 0) {
    await db.insert(services).values(DEFAULT_SERVICES).onConflictDoNothing();
  }

  // العروض
  const offerRows = await db.select({ id: offers.id }).from(offers).limit(1);
  if (offerRows.length === 0) {
    await db
      .insert(offers)
      .values(
        DEFAULT_OFFERS.map((offer) => ({
          ...offer,
          price: "",
          isAvailable: true,
          isActive: true,
          showOnHome: true,
        })),
      )
      .onConflictDoNothing();
  }

  // شركات الباصات وخطوط السير
  const companyRows = await db.select({ id: busCompanies.id }).from(busCompanies).limit(1);
  if (companyRows.length === 0) {
    const inserted = await db
      .insert(busCompanies)
      .values(
        DEFAULT_COMPANIES.map((c) => ({
          ...c,
          logoUrl: "",
          isOfficialPartner: false,
          isActive: true,
        })),
      )
      .onConflictDoNothing()
      .returning({ id: busCompanies.id, name: busCompanies.name });

    if (inserted.length > 0) {
      await db.insert(busRoutes).values(
        DEFAULT_ROUTES.map((route) => ({
          ...route,
          companyId: inserted.find((c) => c.name === route.companyName)?.id ?? null,
          isActive: true,
          sortOrder: 0,
        })),
      );
    }
  }

  // الأسئلة الشائعة
  const faqRows = await db.select({ id: faqs.id }).from(faqs).limit(1);
  if (faqRows.length === 0) {
    await db.insert(faqs).values(DEFAULT_FAQS.map((f) => ({ ...f, isActive: true })));
  }

  // المزايا
  const benefitRows = await db.select({ id: benefits.id }).from(benefits).limit(1);
  if (benefitRows.length === 0) {
    await db.insert(benefits).values(DEFAULT_BENEFITS.map((b) => ({ ...b, isActive: true })));
  }

  // الأرقام السريعة
  const statRows = await db.select({ id: stats.id }).from(stats).limit(1);
  if (statRows.length === 0) {
    await db.insert(stats).values(DEFAULT_STATS.map((s) => ({ ...s, isActive: true })));
  }

  // آراء العملاء — لا تُضاف أي رأي افتراضي، تُدار بالكامل من لوحة التحكم.
  void testimonials;

  // حساب المدير الأول
  const adminRows = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
  if (adminRows.length === 0) {
    const email = (process.env.ADMIN_EMAIL || "admin@essam-aljassim.com").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "Essam@2026";
    await db
      .insert(adminUsers)
      .values({
        email,
        name: "مدير المكتب",
        passwordHash: await hashPassword(password),
        role: "owner",
      })
      .onConflictDoNothing();
  }
}

export function ensureBootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }
  return bootstrapPromise;
}

export { slugify, IMG };
export async function ping() {
  await db.execute(sql`select 1`);
}
