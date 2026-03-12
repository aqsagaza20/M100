// ملف JavaScript الرئيسي للمنصة

// ==================== تهيئة المتغيرات العامة ====================
let currentLanguage = 'ar';
let sessionId = null;
let savedTerms = [];
let userProgress = {
    viewedChapters: [],
    completedQuizzes: [],
    savedTerms: []
};

// قاعدة البيانات (سيتم تحميلها من ملفات JSON)
let database = {
    terms: [],
    prefixes: [],
    roots: [],
    suffixes: [],
    abbreviations: [],
    systems: [],
    questions: []
};

// ==================== التحميل الأولي ====================
document.addEventListener('DOMContentLoaded', async () => {
    // إنشاء أو استرجاع Session ID
    initializeSession();
    
    // تحميل قاعدة البيانات
    await loadDatabase();
    
    // تهيئة الواجهة
    initializeUI();
    
    // تعيين مستمعي الأحداث
    setupEventListeners();
    
    console.log('MedTerm AI جاهز للعمل!');
});

// ==================== إدارة الجلسة ====================
function initializeSession() {
    sessionId = localStorage.getItem('medterm_session');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('medterm_session', sessionId);
    }
    
    // تحميل البيانات المحفوظة
    const saved = localStorage.getItem(`medterm_${sessionId}`);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            savedTerms = data.savedTerms || [];
            userProgress = data.progress || userProgress;
        } catch (e) {
            console.error('خطأ في تحميل البيانات المحفوظة', e);
        }
    }
}

function saveUserData() {
    const data = {
        savedTerms,
        progress: userProgress,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`medterm_${sessionId}`, JSON.stringify(data));
}

// ==================== تحميل قاعدة البيانات ====================
async function loadDatabase() {
    try {
        // محاكاة تحميل البيانات (في الإصدار الحقيقي، سيتم تحميلها من ملفات JSON)
        // هذا الجزء سيتم استبداله بطلبات fetch حقيقية لملفات JSON
        
        // بيانات تجريبية للمصطلحات (سيتم استبدالها بالكامل من Chapter 4-10)
        database.terms = [
            {
                id: 1,
                term: "myocarditis",
                arabic: "التهاب عضلة القلب",
                definition: "Inflammation of the heart muscle",
                root: "cardi",
                prefix: "myo",
                suffix: "itis",
                system: "cardiovascular",
                chapter: 5,
                examples: ["Viral myocarditis", "Acute myocarditis"]
            },
            {
                id: 2,
                term: "osteoporosis",
                arabic: "هشاشة العظام",
                definition: "Condition of porous bones",
                root: "oste",
                suffix: "osis",
                system: "skeletal",
                chapter: 4,
                examples: ["Postmenopausal osteoporosis"]
            },
            {
                id: 3,
                term: "gastroenteritis",
                arabic: "التهاب المعدة والأمعاء",
                definition: "Inflammation of stomach and intestines",
                root1: "gastr",
                root2: "enter",
                suffix: "itis",
                system: "digestive",
                chapter: 8,
                examples: ["Viral gastroenteritis"]
            },
            {
                id: 4,
                term: "nephrolithiasis",
                arabic: "حصى الكلى",
                definition: "Presence of kidney stones",
                root: "nephr",
                suffix: "iasis",
                system: "urinary",
                chapter: 9,
                examples: ["Renal calculi"]
            },
            {
                id: 5,
                term: "hyperthyroidism",
                arabic: "فرط نشاط الغدة الدرقية",
                definition: "Overactive thyroid gland",
                root: "thyroid",
                prefix: "hyper",
                suffix: "ism",
                system: "endocrine",
                chapter: 10,
                examples: ["Graves disease"]
            },
            {
                id: 6,
                term: "pneumonia",
                arabic: "التهاب رئوي",
                definition: "Infection of the lungs",
                root: "pneumon",
                suffix: "ia",
                system: "respiratory",
                chapter: 7,
                examples: ["Bacterial pneumonia"]
            },
            {
                id: 7,
                term: "leukemia",
                arabic: "ابيضاض الدم",
                definition: "Cancer of blood-forming tissues",
                root: "leuk",
                suffix: "emia",
                system: "cardiovascular",
                chapter: 5,
                examples: ["Acute lymphocytic leukemia"]
            },
            {
                id: 8,
                term: "arthritis",
                arabic: "التهاب المفاصل",
                definition: "Inflammation of joints",
                root: "arthr",
                suffix: "itis",
                system: "skeletal",
                chapter: 4,
                examples: ["Rheumatoid arthritis"]
            },
            {
                id: 9,
                term: "hepatitis",
                arabic: "التهاب الكبد",
                definition: "Inflammation of liver",
                root: "hepat",
                suffix: "itis",
                system: "digestive",
                chapter: 8,
                examples: ["Hepatitis B", "Hepatitis C"]
            },
            {
                id: 10,
                term: "cystitis",
                arabic: "التهاب المثانة",
                definition: "Inflammation of bladder",
                root: "cyst",
                suffix: "itis",
                system: "urinary",
                chapter: 9,
                examples: ["Interstitial cystitis"]
            }
        ];
        
        // البادئات (من Chapter 1)
        database.prefixes = [
            { prefix: "a-", meaning: "without, not", arabic: "عدم، بدون" },
            { prefix: "an-", meaning: "without, not", arabic: "عدم، بدون" },
            { prefix: "ab-", meaning: "away from", arabic: "بعيد عن" },
            { prefix: "ad-", meaning: "toward", arabic: "باتجاه" },
            { prefix: "ante-", meaning: "before", arabic: "قبل" },
            { prefix: "anti-", meaning: "against", arabic: "ضد" },
            { prefix: "auto-", meaning: "self", arabic: "ذاتي" },
            { prefix: "bi-", meaning: "two", arabic: "اثنان" },
            { prefix: "brady-", meaning: "slow", arabic: "بطيء" },
            { prefix: "circum-", meaning: "around", arabic: "حول" },
            { prefix: "contra-", meaning: "against", arabic: "ضد" },
            { prefix: "de-", meaning: "down, from", arabic: "أسفل، من" },
            { prefix: "dia-", meaning: "through, complete", arabic: "خلال، كامل" },
            { prefix: "dys-", meaning: "bad, difficult, painful", arabic: "سيء، صعب، مؤلم" },
            { prefix: "ecto-", meaning: "outside", arabic: "خارج" },
            { prefix: "endo-", meaning: "within", arabic: "داخل" },
            { prefix: "epi-", meaning: "upon, above", arabic: "على، فوق" },
            { prefix: "eu-", meaning: "good, normal", arabic: "جيد، طبيعي" },
            { prefix: "exo-", meaning: "outside", arabic: "خارج" },
            { prefix: "extra-", meaning: "outside", arabic: "خارج" },
            { prefix: "hemi-", meaning: "half", arabic: "نصف" },
            { prefix: "hyper-", meaning: "excessive, above", arabic: "فرط، فوق" },
            { prefix: "hypo-", meaning: "deficient, below", arabic: "نقص، تحت" },
            { prefix: "infra-", meaning: "below", arabic: "أسفل" },
            { prefix: "inter-", meaning: "between", arabic: "بين" },
            { prefix: "intra-", meaning: "within", arabic: "داخل" },
            { prefix: "macro-", meaning: "large", arabic: "كبير" },
            { prefix: "mal-", meaning: "bad", arabic: "سيء" },
            { prefix: "mega-", meaning: "large", arabic: "كبير" },
            { prefix: "meta-", meaning: "beyond, change", arabic: "وراء، تغيير" },
            { prefix: "micro-", meaning: "small", arabic: "صغير" },
            { prefix: "multi-", meaning: "many", arabic: "متعدد" },
            { prefix: "neo-", meaning: "new", arabic: "جديد" },
            { prefix: "nulli-", meaning: "none", arabic: "لا شيء" },
            { prefix: "pan-", meaning: "all", arabic: "كل" },
            { prefix: "para-", meaning: "near, beside, abnormal", arabic: "قرب، جانب، غير طبيعي" },
            { prefix: "peri-", meaning: "surrounding", arabic: "حول" },
            { prefix: "poly-", meaning: "many, much", arabic: "متعدد، كثير" },
            { prefix: "post-", meaning: "after, behind", arabic: "بعد، خلف" },
            { prefix: "pre-", meaning: "before, in front", arabic: "قبل، أمام" },
            { prefix: "pseudo-", meaning: "false", arabic: "كاذب" },
            { prefix: "quadri-", meaning: "four", arabic: "أربعة" },
            { prefix: "retro-", meaning: "backward, behind", arabic: "خلفي، وراء" },
            { prefix: "semi-", meaning: "half", arabic: "نصف" },
            { prefix: "sub-", meaning: "under, below", arabic: "تحت، أسفل" },
            { prefix: "super-", meaning: "above, excess", arabic: "فوق، زيادة" },
            { prefix: "supra-", meaning: "above", arabic: "فوق" },
            { prefix: "tachy-", meaning: "fast, rapid", arabic: "سريع" },
            { prefix: "trans-", meaning: "through, across", arabic: "عبر" },
            { prefix: "tri-", meaning: "three", arabic: "ثلاثة" },
            { prefix: "ultra-", meaning: "beyond, excess", arabic: "وراء، زيادة" },
            { prefix: "uni-", meaning: "one", arabic: "واحد" }
        ];
        
        // الجذور (من Chapters 1, 3-10)
        database.roots = [
            // Chapter 1 - الألوان
            { root: "cyan", meaning: "blue", arabic: "أزرق" },
            { root: "erythr", meaning: "red", arabic: "أحمر" },
            { root: "leuk", meaning: "white", arabic: "أبيض" },
            { root: "melan", meaning: "black", arabic: "أسود" },
            { root: "poli", meaning: "gray", arabic: "رمادي" },
            
            // Chapter 3 - أجهزة
            { root: "cyt", meaning: "cell", arabic: "خلية" },
            { root: "hist", meaning: "tissue", arabic: "نسيج" },
            { root: "aden", meaning: "gland", arabic: "غدة" },
            
            // Chapter 4 - الهيكلي
            { root: "oste", meaning: "bone", arabic: "عظم" },
            { root: "arthr", meaning: "joint", arabic: "مفصل" },
            { root: "chondr", meaning: "cartilage", arabic: "غضروف" },
            { root: "ankyl", meaning: "stiff, bent", arabic: "متيبس، منحني" },
            { root: "spondyl", meaning: "vertebra", arabic: "فقرة" },
            { root: "myel", meaning: "bone marrow", arabic: "نخاع عظمي" },
            { root: "crani", meaning: "skull", arabic: "جمجمة" },
            { root: "cost", meaning: "rib", arabic: "ضلع" },
            
            // Chapter 5 - القلب والأوعية
            { root: "cardi", meaning: "heart", arabic: "قلب" },
            { root: "angi", meaning: "vessel", arabic: "وعاء" },
            { root: "vas", meaning: "vessel", arabic: "وعاء" },
            { root: "arteri", meaning: "artery", arabic: "شريان" },
            { root: "phleb", meaning: "vein", arabic: "وريد" },
            { root: "thromb", meaning: "clot", arabic: "خثرة" },
            { root: "hem", meaning: "blood", arabic: "دم" },
            { root: "hemat", meaning: "blood", arabic: "دم" },
            
            // Chapter 6 - اللمفي والمناعي
            { root: "lymph", meaning: "lymph", arabic: "لمف" },
            { root: "lymphaden", meaning: "lymph node", arabic: "عقدة لمفاوية" },
            { root: "splen", meaning: "spleen", arabic: "طحال" },
            { root: "thym", meaning: "thymus", arabic: "غدة زعترية" },
            { root: "onc", meaning: "tumor", arabic: "ورم" },
            { root: "carcin", meaning: "cancer", arabic: "سرطان" },
            { root: "sarc", meaning: "flesh", arabic: "لحم" },
            
            // Chapter 7 - التنفسي
            { root: "nas", meaning: "nose", arabic: "أنف" },
            { root: "rhin", meaning: "nose", arabic: "أنف" },
            { root: "laryng", meaning: "larynx", arabic: "حنجرة" },
            { root: "trache", meaning: "trachea", arabic: "قصبة هوائية" },
            { root: "bronch", meaning: "bronchus", arabic: "شعبة هوائية" },
            { root: "pneumon", meaning: "lung", arabic: "رئة" },
            { root: "pulmon", meaning: "lung", arabic: "رئة" },
            { root: "thorac", meaning: "chest", arabic: "صدر" },
            
            // Chapter 8 - الهضمي
            { root: "or", meaning: "mouth", arabic: "فم" },
            { root: "stomat", meaning: "mouth", arabic: "فم" },
            { root: "cheil", meaning: "lip", arabic: "شفة" },
            { root: "gloss", meaning: "tongue", arabic: "لسان" },
            { root: "dent", meaning: "tooth", arabic: "سن" },
            { root: "esophag", meaning: "esophagus", arabic: "مريء" },
            { root: "gastr", meaning: "stomach", arabic: "معدة" },
            { root: "enter", meaning: "intestine", arabic: "أمعاء" },
            { root: "col", meaning: "colon", arabic: "قولون" },
            { root: "hepat", meaning: "liver", arabic: "كبد" },
            { root: "cholecyst", meaning: "gallbladder", arabic: "مرارة" },
            { root: "pancreat", meaning: "pancreas", arabic: "بنكرياس" },
            
            // Chapter 9 - البولي
            { root: "ren", meaning: "kidney", arabic: "كلية" },
            { root: "nephr", meaning: "kidney", arabic: "كلية" },
            { root: "pyel", meaning: "renal pelvis", arabic: "حويضة كلوية" },
            { root: "ureter", meaning: "ureter", arabic: "حالب" },
            { root: "cyst", meaning: "bladder", arabic: "مثانة" },
            { root: "urethr", meaning: "urethra", arabic: "إحليل" },
            { root: "vesic", meaning: "bladder", arabic: "مثانة" },
            
            // Chapter 10 - الغدد الصماء
            { root: "adren", meaning: "adrenal gland", arabic: "غدة كظرية" },
            { root: "thyroid", meaning: "thyroid", arabic: "درقية" },
            { root: "parathyroid", meaning: "parathyroid", arabic: "جارة الدرقية" },
            { root: "pituitary", meaning: "pituitary", arabic: "نخامية" },
            { root: "pineal", meaning: "pineal", arabic: "صنوبرية" },
            { root: "gonad", meaning: "sex gland", arabic: "غدة جنسية" },
            { root: "crin", meaning: "to secrete", arabic: "إفراز" }
        ];
        
        // اللواحق (من Chapters 1, 2, 3)
        database.suffixes = [
            // لواحق الحالات المرضية
            { suffix: "itis", meaning: "inflammation", arabic: "التهاب" },
            { suffix: "osis", meaning: "abnormal condition", arabic: "حالة مرضية" },
            { suffix: "iasis", meaning: "abnormal condition", arabic: "حالة مرضية" },
            { suffix: "esis", meaning: "abnormal condition", arabic: "حالة مرضية" },
            { suffix: "ia", meaning: "abnormal condition", arabic: "حالة مرضية" },
            { suffix: "ism", meaning: "condition", arabic: "حالة" },
            { suffix: "oma", meaning: "tumor", arabic: "ورم" },
            { suffix: "pathy", meaning: "disease", arabic: "مرض" },
            { suffix: "algia", meaning: "pain", arabic: "ألم" },
            { suffix: "dynia", meaning: "pain", arabic: "ألم" },
            { suffix: "malacia", meaning: "abnormal softening", arabic: "تليين مرضي" },
            { suffix: "sclerosis", meaning: "abnormal hardening", arabic: "تصلب" },
            { suffix: "stenosis", meaning: "abnormal narrowing", arabic: "تضيق" },
            { suffix: "necrosis", meaning: "tissue death", arabic: "نخر" },
            { suffix: "megaly", meaning: "enlargement", arabic: "تضخم" },
            { suffix: "ectasis", meaning: "dilation, expansion", arabic: "تمدد" },
            { suffix: "emia", meaning: "blood condition", arabic: "حالة دموية" },
            { suffix: "uria", meaning: "urine condition", arabic: "حالة بولية" },
            
            // لواحق الإجراءات
            { suffix: "ectomy", meaning: "surgical removal", arabic: "استئصال جراحي" },
            { suffix: "otomy", meaning: "surgical incision", arabic: "شق جراحي" },
            { suffix: "ostomy", meaning: "creation of opening", arabic: "فتح جراحي" },
            { suffix: "plasty", meaning: "surgical repair", arabic: "ترميم جراحي" },
            { suffix: "desis", meaning: "surgical fixation", arabic: "تثبيت جراحي" },
            { suffix: "pexy", meaning: "surgical fixation", arabic: "تثبيت جراحي" },
            { suffix: "lysis", meaning: "loosening, destruction", arabic: "تحرير، تدمير" },
            { suffix: "centesis", meaning: "surgical puncture", arabic: "بزل جراحي" },
            { suffix: "graphy", meaning: "process of recording", arabic: "تصوير" },
            { suffix: "gram", meaning: "record, picture", arabic: "صورة، تسجيل" },
            { suffix: "scopy", meaning: "visual examination", arabic: "فحص بصري" },
            
            // اللواحق المزدوجة RR
            { suffix: "rrhage", meaning: "bursting forth, bleeding", arabic: "نزيف" },
            { suffix: "rrhagia", meaning: "bursting forth, bleeding", arabic: "نزيف" },
            { suffix: "rrhaphy", meaning: "surgical suturing", arabic: "خياطة جراحية" },
            { suffix: "rrhea", meaning: "flow, discharge", arabic: "جريان، إفراز" },
            { suffix: "rrhexis", meaning: "rupture", arabic: "تمزق" },
            
            // لواحق التشخيص والعلامات
            { suffix: "gnosis", meaning: "knowledge", arabic: "معرفة" },
            { suffix: "plasia", meaning: "formation, development", arabic: "تكون، تطور" },
            { suffix: "phagia", meaning: "eating, swallowing", arabic: "أكل، بلع" },
            { suffix: "plegia", meaning: "paralysis", arabic: "شلل" },
            { suffix: "pnea", meaning: "breathing", arabic: "تنفس" },
            { suffix: "ptosis", meaning: "drooping, falling", arabic: "تدلي" },
            
            // لواحق الصفات
            { suffix: "ac", meaning: "pertaining to", arabic: "متعلق بـ" },
            { suffix: "al", meaning: "pertaining to", arabic: "متعلق بـ" },
            { suffix: "ar", meaning: "pertaining to", arabic: "متعلق بـ" },
            { suffix: "ary", meaning: "pertaining to", arabic: "متعلق بـ" },
            { suffix: "ic", meaning: "pertaining to", arabic: "متعلق بـ" },
            { suffix: "ous", meaning: "pertaining to", arabic: "متعلق بـ" },
            
            // لواحق المفرد والجمع (Chapter 2)
            { suffix: "a", meaning: "singular", arabic: "مفرد", plural: "ae" },
            { suffix: "is", meaning: "singular", arabic: "مفرد", plural: "es" },
            { suffix: "ex", meaning: "singular", arabic: "مفرد", plural: "ices" },
            { suffix: "ix", meaning: "singular", arabic: "مفرد", plural: "ices" },
            { suffix: "nx", meaning: "singular", arabic: "مفرد", plural: "ges" },
            { suffix: "on", meaning: "singular", arabic: "مفرد", plural: "a" },
            { suffix: "um", meaning: "singular", arabic: "مفرد", plural: "a" },
            { suffix: "us", meaning: "singular", arabic: "مفرد", plural: "i" }
        ];
        
        // الاختصارات (من Chapter 11)
        database.abbreviations = [
            { abbr: "AB", meaning: "Antibody", arabic: "جسم مضاد" },
            { abbr: "ABG", meaning: "Arterial Blood Gases", arabic: "غازات الدم الشرياني" },
            { abbr: "ACTH", meaning: "Adrenocorticotropic Hormone", arabic: "الهرمون الموجه لقشر الكظر" },
            { abbr: "AIDS", meaning: "Acquired Immune Deficiency Syndrome", arabic: "متلازمة نقص المناعة المكتسب" },
            { abbr: "ALP", meaning: "Alkaline Phosphatase", arabic: "الفوسفاتاز القلوي" },
            { abbr: "ALT", meaning: "Alanine Aminotransferase", arabic: "ناقلة أمين الألانين" },
            { abbr: "AMI", meaning: "Acute Myocardial Infarction", arabic: "احتشاء عضلة القلب الحاد" },
            { abbr: "AST", meaning: "Aspartate Aminotransferase", arabic: "ناقلة أمين الأسبارتات" },
            { abbr: "BP", meaning: "Blood Pressure", arabic: "ضغط الدم" },
            { abbr: "BUN", meaning: "Blood Urea Nitrogen", arabic: "نيتروجين يوريا الدم" },
            { abbr: "CBC", meaning: "Complete Blood Count", arabic: "تعداد الدم الكامل" },
            { abbr: "CHF", meaning: "Congestive Heart Failure", arabic: "فشل القلب الاحتقاني" },
            { abbr: "CMV", meaning: "Cytomegalovirus", arabic: "الفيروس المضخم للخلايا" },
            { abbr: "CNS", meaning: "Central Nervous System", arabic: "الجهاز العصبي المركزي" },
            { abbr: "COPD", meaning: "Chronic Obstructive Pulmonary Disease", arabic: "مرض الانسداد الرئوي المزمن" },
            { abbr: "CPR", meaning: "Cardiopulmonary Resuscitation", arabic: "إنعاش قلبي رئوي" },
            { abbr: "CRP", meaning: "C-Reactive Protein", arabic: "بروتين سي التفاعلي" },
            { abbr: "CSF", meaning: "Cerebrospinal Fluid", arabic: "السائل الدماغي الشوكي" },
            { abbr: "CT", meaning: "Computed Tomography", arabic: "التصوير المقطعي" },
            { abbr: "CXR", meaning: "Chest X-Ray", arabic: "أشعة سينية للصدر" },
            { abbr: "DM", meaning: "Diabetes Mellitus", arabic: "داء السكري" },
            { abbr: "DVT", meaning: "Deep Vein Thrombosis", arabic: "خثار الوريد العميق" },
            { abbr: "EBV", meaning: "Epstein-Barr Virus", arabic: "فيروس إبشتاين-بار" },
            { abbr: "ECG", meaning: "Electrocardiogram", arabic: "تخطيط القلب الكهربائي" },
            { abbr: "EEG", meaning: "Electroencephalogram", arabic: "تخطيط الدماغ الكهربائي" },
            { abbr: "ENT", meaning: "Ear, Nose, Throat", arabic: "أنف وأذن وحنجرة" },
            { abbr: "ER", meaning: "Emergency Room", arabic: "غرفة الطوارئ" },
            { abbr: "ESR", meaning: "Erythrocyte Sedimentation Rate", arabic: "سرعة ترسيب الدم" },
            { abbr: "FBS", meaning: "Fasting Blood Sugar", arabic: "سكر الدم الصائم" },
            { abbr: "FNA", meaning: "Fine-Needle Aspiration", arabic: "شفط بإبرة دقيقة" },
            { abbr: "FSH", meaning: "Follicle-Stimulating Hormone", arabic: "الهرمون المنبه للجريب" },
            { abbr: "GERD", meaning: "Gastroesophageal Reflux Disease", arabic: "مرض الجزر المعدي المريئي" },
            { abbr: "GI", meaning: "Gastrointestinal", arabic: "جهاز هضمي" },
            { abbr: "GTT", meaning: "Glucose Tolerance Test", arabic: "اختبار تحمل الغلوكوز" },
            { abbr: "HAV", meaning: "Hepatitis A Virus", arabic: "فيروس التهاب الكبد A" },
            { abbr: "Hb", meaning: "Hemoglobin", arabic: "هيموغلوبين" },
            { abbr: "HBV", meaning: "Hepatitis B Virus", arabic: "فيروس التهاب الكبد B" },
            { abbr: "HCT", meaning: "Hematocrit", arabic: "الهيماتوكريت" },
            { abbr: "HCV", meaning: "Hepatitis C Virus", arabic: "فيروس التهاب الكبد C" },
            { abbr: "HIV", meaning: "Human Immunodeficiency Virus", arabic: "فيروس نقص المناعة البشرية" },
            { abbr: "HLA", meaning: "Human Leukocyte Antigen", arabic: "مستضد الكريات البيضاء البشرية" },
            { abbr: "HR", meaning: "Heart Rate", arabic: "معدل ضربات القلب" },
            { abbr: "HSV", meaning: "Herpes Simplex Virus", arabic: "فيروس الهربس البسيط" },
            { abbr: "IBS", meaning: "Irritable Bowel Syndrome", arabic: "متلازمة القولون العصبي" },
            { abbr: "ICU", meaning: "Intensive Care Unit", arabic: "وحدة العناية المركزة" },
            { abbr: "Ig", meaning: "Immunoglobulin", arabic: "غلوبيولين مناعي" },
            { abbr: "IM", meaning: "Intramuscular", arabic: "عضلي" },
            { abbr: "IV", meaning: "Intravenous", arabic: "وريدي" },
            { abbr: "KUB", meaning: "Kidneys, Ureters, Bladder", arabic: "كلى، حالب، مثانة" },
            { abbr: "MRI", meaning: "Magnetic Resonance Imaging", arabic: "التصوير بالرنين المغناطيسي" },
            { abbr: "MS", meaning: "Multiple Sclerosis", arabic: "التصلب المتعدد" },
            { abbr: "MVA", meaning: "Motor Vehicle Accident", arabic: "حادث سيارة" },
            { abbr: "NPO", meaning: "Nothing by Mouth", arabic: "لا شيء بالفم" },
            { abbr: "NSAID", meaning: "Nonsteroidal Anti-Inflammatory Drug", arabic: "مضاد التهاب غير ستيرويدي" },
            { abbr: "OA", meaning: "Osteoarthritis", arabic: "فصال عظمي" },
            { abbr: "OR", meaning: "Operating Room", arabic: "غرفة العمليات" },
            { abbr: "OT", meaning: "Occupational Therapy", arabic: "علاج وظيفي" },
            { abbr: "OTC", meaning: "Over the Counter", arabic: "دون وصفة طبية" },
            { abbr: "PEG", meaning: "Percutaneous Endoscopic Gastrostomy", arabic: "فغر المعدة بالمنظار عن طريق الجلد" },
            { abbr: "PFT", meaning: "Pulmonary Function Test", arabic: "اختبار وظائف الرئة" },
            { abbr: "PID", meaning: "Pelvic Inflammatory Disease", arabic: "مرض التهاب الحوض" },
            { abbr: "PKU", meaning: "Phenylketonuria", arabic: "بيلة فينيل كيتون" },
            { abbr: "PLT", meaning: "Platelet", arabic: "صفيحة دموية" },
            { abbr: "PT", meaning: "Physical Therapy", arabic: "علاج طبيعي" },
            { abbr: "PT", meaning: "Prothrombin Time", arabic: "زمن البروثرومبين" },
            { abbr: "PTT", meaning: "Partial Thromboplastin Time", arabic: "زمن الثرومبوبلاستين الجزئي" },
            { abbr: "RA", meaning: "Rheumatoid Arthritis", arabic: "التهاب المفاصل الروماتويدي" },
            { abbr: "RBC", meaning: "Red Blood Cell", arabic: "خلية دم حمراء" },
            { abbr: "RF", meaning: "Rheumatoid Factor", arabic: "العامل الروماتويدي" },
            { abbr: "Rh", meaning: "Rhesus", arabic: "عامل ريسوس" },
            { abbr: "RIA", meaning: "Radioimmunoassay", arabic: "مقايسة مناعية إشعاعية" },
            { abbr: "R/O", meaning: "Rule Out", arabic: "استبعاد" },
            { abbr: "RR", meaning: "Respiratory Rate", arabic: "معدل التنفس" },
            { abbr: "RT", meaning: "Respiratory Therapy", arabic: "علاج تنفسي" },
            { abbr: "SIDS", meaning: "Sudden Infant Death Syndrome", arabic: "متلازمة موت الرضع المفاجئ" },
            { abbr: "SOB", meaning: "Shortness of Breath", arabic: "ضيق التنفس" },
            { abbr: "STAT", meaning: "Immediately", arabic: "فوراً" },
            { abbr: "STD", meaning: "Sexually Transmitted Disease", arabic: "مرض منقول جنسياً" },
            { abbr: "T&A", meaning: "Tonsillectomy and Adenoidectomy", arabic: "استئصال اللوزتين والغدانيات" },
            { abbr: "TB", meaning: "Tuberculosis", arabic: "سل" },
            { abbr: "TIA", meaning: "Transient Ischemic Attack", arabic: "نوبة نقص تروية عابرة" },
            { abbr: "TIBC", meaning: "Total Iron-Binding Capacity", arabic: "إجمالي سعة ربط الحديد" },
            { abbr: "TMJ", meaning: "Temporomandibular Joint", arabic: "مفصل صدغي فكي" },
            { abbr: "TPN", meaning: "Total Parenteral Nutrition", arabic: "تغذية وريدية كلية" },
            { abbr: "TSH", meaning: "Thyroid-Stimulating Hormone", arabic: "الهرمون المنبه للدرقية" },
            { abbr: "TURP", meaning: "Transurethral Resection of Prostate", arabic: "استئصال البروستات عبر الإحليل" },
            { abbr: "UA", meaning: "Urinalysis", arabic: "تحليل بول" },
            { abbr: "URI", meaning: "Upper Respiratory Infection", arabic: "عدوى الجهاز التنفسي العلوي" },
            { abbr: "UTI", meaning: "Urinary Tract Infection", arabic: "عدوى المسالك البولية" },
            { abbr: "UV", meaning: "Ultraviolet", arabic: "فوق بنفسجي" },
            { abbr: "VDRL", meaning: "Venereal Disease Research Laboratory", arabic: "اختبار الزهري" },
            { abbr: "WBC", meaning: "White Blood Cell", arabic: "خلية دم بيضاء" }
        ];
        
        // الأجهزة التشريحية
        database.systems = [
            { 
                id: "skeletal", 
                name: "Skeletal System", 
                arabic: "الجهاز الهيكلي",
                description: "Provides support, protection, and movement",
                terms: ["osteoporosis", "arthritis", "osteomyelitis"]
            },
            { 
                id: "cardiovascular", 
                name: "Cardiovascular System", 
                arabic: "الجهاز القلبي الوعائي",
                description: "Transports blood, oxygen, and nutrients",
                terms: ["myocarditis", "leukemia", "thrombosis"]
            },
            { 
                id: "respiratory", 
                name: "Respiratory System", 
                arabic: "الجهاز التنفسي",
                description: "Facilitates gas exchange",
                terms: ["pneumonia", "bronchitis", "asthma"]
            },
            { 
                id: "digestive", 
                name: "Digestive System", 
                arabic: "الجهاز الهضمي",
                description: "Breaks down food and absorbs nutrients",
                terms: ["gastroenteritis", "hepatitis", "cirrhosis"]
            },
            { 
                id: "urinary", 
                name: "Urinary System", 
                arabic: "الجهاز البولي",
                description: "Filters blood and eliminates waste",
                terms: ["nephrolithiasis", "cystitis", "pyelonephritis"]
            },
            { 
                id: "endocrine", 
                name: "Endocrine System", 
                arabic: "جهاز الغدد الصماء",
                description: "Produces hormones for regulation",
                terms: ["hyperthyroidism", "diabetes", "acromegaly"]
            },
            { 
                id: "lymphatic", 
                name: "Lymphatic System", 
                arabic: "الجهاز اللمفي",
                description: "Fights infection and maintains fluid balance",
                terms: ["lymphoma", "splenomegaly", "lymphadenitis"]
            },
            { 
                id: "nervous", 
                name: "Nervous System", 
                arabic: "الجهاز العصبي",
                description: "Controls and coordinates body functions",
                terms: ["neuritis", "meningitis", "encephalitis"]
            },
            { 
                id: "muscular", 
                name: "Muscular System", 
                arabic: "الجهاز العضلي",
                description: "Enables movement",
                terms: ["myalgia", "myositis", "muscular dystrophy"]
            },
            { 
                id: "integumentary", 
                name: "Integumentary System", 
                arabic: "الجهاز اللحافي",
                description: "Protects the body",
                terms: ["dermatitis", "melanoma", "eczema"]
            }
        ];
        
        // أسئلة الاختبارات
        database.questions = [
            {
                id: 1,
                question: "What does the suffix '-itis' mean?",
                options: ["Pain", "Inflammation", "Tumor", "Disease"],
                correct: 1,
                chapter: 1,
                system: "general"
            },
            {
                id: 2,
                question: "ما معنى البادئة 'hyper-'؟",
                options: ["نقص", "فرط", "تحت", "بين"],
                correct: 1,
                chapter: 1,
                system: "general"
            },
            {
                id: 3,
                question: "Myocarditis is inflammation of the:",
                options: ["Heart muscle", "Heart lining", "Heart valves", "Pericardium"],
                correct: 0,
                chapter: 5,
                system: "cardiovascular"
            },
            {
                id: 4,
                question: "أي مما يلي يعني 'هشاشة العظام'؟",
                options: ["Arthritis", "Osteoporosis", "Osteomyelitis", "Osteomalacia"],
                correct: 1,
                chapter: 4,
                system: "skeletal"
            },
            {
                id: 5,
                question: "The root 'nephr' refers to which organ?",
                options: ["Liver", "Heart", "Kidney", "Lung"],
                correct: 2,
                chapter: 9,
                system: "urinary"
            },
            {
                id: 6,
                question: "True or False: 'ectomy' means surgical incision.",
                options: ["True", "False"],
                correct: 1,
                chapter: 1,
                system: "general"
            },
            {
                id: 7,
                question: "Pneumonia affects which system?",
                options: ["Cardiovascular", "Respiratory", "Digestive", "Nervous"],
                correct: 1,
                chapter: 7,
                system: "respiratory"
            },
            {
                id: 8,
                question: "ما معنى الاختصار 'CXR'؟",
                options: ["تخطيط قلب", "أشعة صدر", "تحليل دم", "رنين مغناطيسي"],
                correct: 1,
                chapter: 11,
                system: "general"
            },
            {
                id: 9,
                question: "The suffix '-emia' refers to:",
                options: ["Blood condition", "Pain", "Swelling", "Tumor"],
                correct: 0,
                chapter: 1,
                system: "general"
            },
            {
                id: 10,
                question: "Gastroenteritis involves inflammation of:",
                options: ["Stomach and liver", "Stomach and intestines", "Intestines and colon", "Esophagus and stomach"],
                correct: 1,
                chapter: 8,
                system: "digestive"
            },
            {
                id: 11,
                question: "أي من التالي يعني 'تصلب الشرايين'؟",
                options: ["Atherosclerosis", "Arteriosclerosis", "Atheroma", "Arteritis"],
                correct: 1,
                chapter: 5,
                system: "cardiovascular"
            },
            {
                id: 12,
                question: "The prefix 'brady-' means:",
                options: ["Fast", "Slow", "Irregular", "Absent"],
                correct: 1,
                chapter: 1,
                system: "general"
            },
            {
                id: 13,
                question: "Cystitis is inflammation of the:",
                options: ["Kidney", "Ureter", "Bladder", "Urethra"],
                correct: 2,
                chapter: 9,
                system: "urinary"
            },
            {
                id: 14,
                question: "ما معنى الاختصار 'DM'؟",
                options: ["داء السكري", "ضغط الدم", "فشل القلب", "مرض الكلى"],
                correct: 0,
                chapter: 11,
                system: "general"
            },
            {
                id: 15,
                question: "The root 'hepat' refers to:",
                options: ["Heart", "Liver", "Kidney", "Lung"],
                correct: 1,
                chapter: 8,
                system: "digestive"
            },
            {
                id: 16,
                question: "True or False: 'rrhage' means surgical suturing.",
                options: ["True", "False"],
                correct: 1,
                chapter: 1,
                system: "general"
            },
            {
                id: 17,
                question: "Hyperthyroidism involves which gland?",
                options: ["Pituitary", "Thyroid", "Adrenal", "Pancreas"],
                correct: 1,
                chapter: 10,
                system: "endocrine"
            },
            {
                id: 18,
                question: "أي مما يلي يعني 'التهاب المفاصل'؟",
                options: ["Osteitis", "Arthritis", "Bursitis", "Tendonitis"],
                correct: 1,
                chapter: 4,
                system: "skeletal"
            },
            {
                id: 19,
                question: "The suffix '-plegia' means:",
                options: ["Pain", "Paralysis", "Breathing", "Swallowing"],
                correct: 1,
                chapter: 1,
                system: "general"
            },
            {
                id: 20,
                question: "Leukemia is cancer of which cells?",
                options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
                correct: 1,
                chapter: 5,
                system: "cardiovascular"
            }
        ];
        
        console.log('✅ قاعدة البيانات تم تحميلها بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في تحميل قاعدة البيانات:', error);
    }
}

// ==================== تهيئة واجهة المستخدم ====================
function initializeUI() {
    // عرض الفصول في الصفحة الرئيسية
    renderChapters();
    
    // عرض الأجهزة في الصفحة الرئيسية
    renderSystemsPreview();
    
    // عرض الاختصارات الهامة
    renderAbbrevPreview();
    
    // تطبيق اللغة المحفوظة
    applyLanguage();
}

function renderChapters() {
    const grid = document.getElementById('chapters-grid');
    if (!grid) return;
    
    const chapters = [];
    for (let i = 1; i <= 11; i++) {
        chapters.push({
            number: i,
            title: `Chapter ${i}`,
            arabic: `الفصل ${i}`
        });
    }
    
    grid.innerHTML = chapters.map(ch => `
        <div class="chapter-item" onclick="window.location.href='pages/chapters.html?chapter=${ch.number}'">
            <div class="chapter-number">${ch.number}</div>
            <div class="chapter-title">${currentLanguage === 'ar' ? ch.arabic : ch.title}</div>
        </div>
    `).join('');
}

function renderSystemsPreview() {
    const preview = document.getElementById('systems-preview');
    if (!preview) return;
    
    const icons = {
        skeletal: 'bone',
        cardiovascular: 'heart',
        respiratory: 'lungs',
        digestive: 'stethoscope',
        urinary: 'tint',
        endocrine: 'magnet',
        lymphatic: 'shield-alt',
        nervous: 'brain',
        muscular: 'dumbbell',
        integumentary: 'hand'
    };
    
    preview.innerHTML = database.systems.slice(0, 6).map(sys => `
        <div class="system-preview-card" onclick="window.location.href='pages/systems.html?system=${sys.id}'">
            <i class="fas fa-${icons[sys.id] || 'book'}"></i>
            <span>${currentLanguage === 'ar' ? sys.arabic : sys.name}</span>
        </div>
    `).join('');
}

function renderAbbrevPreview() {
    const preview = document.getElementById('abbrev-preview');
    if (!preview) return;
    
    const topAbbrevs = database.abbreviations.slice(0, 8);
    
    preview.innerHTML = topAbbrevs.map(ab => `
        <div class="abbrev-badge">
            <span>${ab.abbr}</span>
            <small>${currentLanguage === 'ar' ? ab.arabic : ab.meaning}</small>
        </div>
    `).join('');
}

// ==================== البحث ====================
function search(query) {
    if (!query || query.length < 2) return [];
    
    query = query.toLowerCase();
    
    const results = [];
    
    // البحث في المصطلحات
    database.terms.forEach(term => {
        if (term.term.toLowerCase().includes(query) ||
            term.arabic.includes(query) ||
            (term.definition && term.definition.toLowerCase().includes(query)) ||
            (term.root && term.root.includes(query)) ||
            (term.system && term.system.includes(query))) {
            results.push({
                type: 'term',
                id: term.id,
                title: term.term,
                subtitle: term.arabic,
                data: term
            });
        }
    });
    
    // البحث في الاختصارات
    database.abbreviations.forEach(ab => {
        if (ab.abbr.toLowerCase().includes(query) ||
            ab.meaning.toLowerCase().includes(query) ||
            ab.arabic.includes(query)) {
            results.push({
                type: 'abbreviation',
                id: ab.abbr,
                title: ab.abbr,
                subtitle: currentLanguage === 'ar' ? ab.arabic : ab.meaning,
                data: ab
            });
        }
    });
    
    // البحث في الجذور
    database.roots.forEach(root => {
        if (root.root.includes(query) ||
            root.meaning.includes(query) ||
            root.arabic.includes(query)) {
            results.push({
                type: 'root',
                id: root.root,
                title: root.root,
                subtitle: currentLanguage === 'ar' ? root.arabic : root.meaning,
                data: root
            });
        }
    });
    
    return results.slice(0, 20); // حد أقصى 20 نتيجة
}

// ==================== تحليل المصطلح ====================
function analyzeTerm(term) {
    const result = {
        original: term,
        prefix: null,
        root: [],
        suffix: null,
        meaning: '',
        found: false
    };
    
    // البحث عن المصطلح في قاعدة البيانات
    const exactMatch = database.terms.find(t => t.term.toLowerCase() === term.toLowerCase());
    if (exactMatch) {
        result.found = true;
        result.meaning = exactMatch.definition;
        result.arabic = exactMatch.arabic;
        if (exactMatch.prefix) {
            const prefixData = database.prefixes.find(p => p.prefix === exactMatch.prefix);
            result.prefix = {
                part: exactMatch.prefix,
                meaning: prefixData ? (currentLanguage === 'ar' ? prefixData.arabic : prefixData.meaning) : ''
            };
        }
        if (exactMatch.root) {
            const rootData = database.roots.find(r => r.root === exactMatch.root);
            result.root.push({
                part: exactMatch.root,
                meaning: rootData ? (currentLanguage === 'ar' ? rootData.arabic : rootData.meaning) : ''
            });
        }
        if (exactMatch.root1) {
            const root1Data = database.roots.find(r => r.root === exactMatch.root1);
            result.root.push({
                part: exactMatch.root1,
                meaning: root1Data ? (currentLanguage === 'ar' ? root1Data.arabic : root1Data.meaning) : ''
            });
        }
        if (exactMatch.root2) {
            const root2Data = database.roots.find(r => r.root === exactMatch.root2);
            result.root.push({
                part: exactMatch.root2,
                meaning: root2Data ? (currentLanguage === 'ar' ? root2Data.arabic : root2Data.meaning) : ''
            });
        }
        if (exactMatch.suffix) {
            const suffixData = database.suffixes.find(s => s.suffix === exactMatch.suffix);
            result.suffix = {
                part: exactMatch.suffix,
                meaning: suffixData ? (currentLanguage === 'ar' ? suffixData.arabic : suffixData.meaning) : ''
            };
        }
        return result;
    }
    
    // تحليل المصطلح إلى أجزاء
    // هذه خوارزمية مبسطة، يمكن تطويرها لاحقاً
    const lowerTerm = term.toLowerCase();
    
    // البحث عن بادئة
    for (const p of database.prefixes) {
        if (lowerTerm.startsWith(p.prefix.replace('-', ''))) {
            result.prefix = {
                part: p.prefix,
                meaning: currentLanguage === 'ar' ? p.arabic : p.meaning
            };
            break;
        }
    }
    
    // البحث عن لاحقة
    for (const s of database.suffixes) {
        if (s.suffix && lowerTerm.endsWith(s.suffix.replace('-', ''))) {
            result.suffix = {
                part: s.suffix,
                meaning: currentLanguage === 'ar' ? s.arabic : s.meaning
            };
            break;
        }
    }
    
    return result;
}

// ==================== إدارة اللغة ====================
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    const langBtn = document.getElementById('language-toggle');
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'ar' ? 'EN' : 'عربي';
    }
    
    applyLanguage();
    saveUserData();
}

function applyLanguage() {
    // تغيير نصوص العناصر التي تحمل data-lang
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        // هنا يمكن جلب الترجمة من ملفات lang
        // للإصدار الحالي، سنكتفي بتغيير الاتجاه
    });
    
    // إعادة عرض بعض العناصر
    renderChapters();
    renderSystemsPreview();
    renderAbbrevPreview();
}

// ==================== الاختبارات ====================
function getRandomQuestions(count = 5) {
    const shuffled = [...database.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function showQuiz() {
    const questions = getRandomQuestions(5);
    const modal = document.getElementById('quiz-modal');
    const body = document.getElementById('quiz-body');
    
    if (!modal || !body) return;
    
    let html = '';
    questions.forEach((q, idx) => {
        html += `
            <div class="quiz-question" data-qid="${q.id}">
                <p>${idx + 1}. ${q.question}</p>
                <div class="quiz-options">
        `;
        
        q.options.forEach((opt, optIdx) => {
            html += `
                <label class="quiz-option">
                    <input type="radio" name="q${q.id}" value="${optIdx}">
                    <span>${opt}</span>
                </label>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
        <button id="submit-quiz" class="quick-card" style="width:100%; margin-top:20px;">تصحيح الإجابات</button>
    `;
    
    body.innerHTML = html;
    modal.classList.add('active');
    
    document.getElementById('submit-quiz')?.addEventListener('click', () => {
        checkQuizAnswers(questions);
    });
}

function checkQuizAnswers(questions) {
    let score = 0;
    
    questions.forEach(q => {
        const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
            score++;
            selected.parentElement.style.backgroundColor = '#d4edda';
        } else if (selected) {
            selected.parentElement.style.backgroundColor = '#f8d7da';
        }
    });
    
    alert(`نتيجتك: ${score} من ${questions.length}`);
}

// ==================== مستمعي الأحداث ====================
function setupEventListeners() {
    // البحث الرئيسي
    const searchInput = document.getElementById('main-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length >= 2) {
                const results = search(query);
                // عرض النتائج في صفحة البحث
                if (results.length > 0) {
                    window.location.href = `pages/search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    // زر تبديل اللغة
    const langToggle = document.getElementById('language-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    
    // زر الاختبار السريع
    const quizCard = document.getElementById('quiz-card');
    if (quizCard) {
        quizCard.addEventListener('click', (e) => {
            e.preventDefault();
            showQuiz();
        });
    }
    
    // إغلاق النوافذ المنبثقة
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    // النقر خارج النافذة المنبثقة
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// ==================== دوال مساعدة ====================
function saveTerm(termId) {
    if (!savedTerms.includes(termId)) {
        savedTerms.push(termId);
        saveUserData();
        return true;
    }
    return false;
}

function removeSavedTerm(termId) {
    const index = savedTerms.indexOf(termId);
    if (index > -1) {
        savedTerms.splice(index, 1);
        saveUserData();
        return true;
    }
    return false;
}

function isTermSaved(termId) {
    return savedTerms.includes(termId);
}

// ==================== دوال التصدير ====================
window.medTermAI = {
    search,
    analyzeTerm,
    getRandomQuestions,
    saveTerm,
    removeSavedTerm,
    isTermSaved,
    database,
    toggleLanguage
};
