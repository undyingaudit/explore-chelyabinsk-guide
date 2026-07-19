export type Category =
  | "landmark"
  | "museum"
  | "theatre"
  | "gallery"
  | "monument"
  | "park"
  | "sport"
  | "leisure"
  | "religion"
  | "music"
  | "library";

export interface Attraction {
  id: string;
  name: string;
  category: Category;
  district: string;
  lat: number;
  lng: number;
  address: string;
  description: string;
  history?: string;
  details?: string;
  hours?: string;
  website?: string;
  image: string;
  free: boolean;
}

// Изображения из Wikimedia Commons (Special:FilePath — свободные лицензии)
const wm = (file: string, w = 900) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
const unsp = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

export const CHELYABINSK_CENTER = { lat: 55.1614, lng: 61.4008 };

export const DISTRICTS = [
  "Центральный", "Советский", "Курчатовский", "Тракторозаводский",
  "Ленинский", "Металлургический", "Калининский",
] as const;

export const CATEGORY_LABEL: Record<Category, string> = {
  landmark: "Достопримечательности",
  museum: "Музеи",
  theatre: "Театры",
  gallery: "Галереи",
  monument: "Памятники",
  park: "Парки и скверы",
  sport: "Спорт",
  leisure: "Отдых",
  religion: "Храмы",
  music: "Концертные залы",
  library: "Библиотеки",
};

export const ATTRACTIONS: Attraction[] = [
  { id: "kirovka", name: "Пешеходная Кировка", category: "landmark", district: "Центральный", lat: 55.1614, lng: 61.4008, address: "ул. Кирова", description: "Челябинский «Арбат» со скульптурами, кафе и уличными музыкантами.", history: "Пешеходной улица стала в 2000-х. Более 20 бронзовых скульптур: нищий, модница, мальчик с верблюдом.", details: "Кировка проходит через историческое ядро города. Здесь сохранились купеческие дома XIX века, работает уличная сцена, зимой ставят главную ёлку города.", hours: "круглосуточно", image: wm("Kirovka Street Chelyabinsk.jpg"), free: true },
  { id: "revolution-square", name: "Площадь Революции", category: "landmark", district: "Центральный", lat: 55.1601, lng: 61.4025, address: "пл. Революции", description: "Главная площадь города с памятником Ленину и фонтаном.", history: "Сформирована в 1920-х. Здесь проходят все городские праздники и парады.", details: "Главная сцена Дня города, новогодних ярмарок и парадов Победы. По периметру — здания сталинского ампира.", hours: "круглосуточно", image: wm("Revolution Square Chelyabinsk.jpg"), free: true },
  { id: "gagarin-park", name: "ЦПКиО им. Ю. А. Гагарина", category: "park", district: "Центральный", lat: 55.1441, lng: 61.3785, address: "ул. Коммуны, 200", description: "Крупнейший парк с сосновым бором, озером и аттракционами.", history: "Основан в 1936 году в сосновом бору на месте старых каменоломен.", details: "Более 100 га леса в черте города, каскад карьерных озёр, лыжные и веломаршруты, аттракционы и летняя эстрада.", hours: "07:00–23:00", website: "https://parkgagarina.ru", image: wm("Gagarin Park Chelyabinsk.jpg"), free: true },
  { id: "history-museum", name: "Государственный исторический музей Южного Урала", category: "museum", district: "Центральный", lat: 55.1607, lng: 61.4085, address: "ул. Труда, 100", description: "Хранит крупнейший фрагмент челябинского метеорита 2013 года.", history: "Открыт в 1923 году. С 2006-го — новое здание на набережной Миасса, стилизованное под три башни городской крепости.", details: "Постоянные экспозиции: природа Южного Урала, история края, Танкоград, метеорит «Челябинск» (главный осколок 505 кг).", hours: "10:00–19:00, вых. пн.", website: "https://chelmuseum.ru", image: wm("Chelyabinsk State Museum.jpg"), free: false },
  { id: "opera-theatre", name: "Театр оперы и балета им. М. И. Глинки", category: "theatre", district: "Центральный", lat: 55.1622, lng: 61.4022, address: "пл. Ярославского, 1", description: "Один из ведущих музыкальных театров Урала.", history: "Открыт в 1956 году. Здание — памятник архитектуры в стиле сталинского ампира.", details: "В репертуаре — русская и мировая классика, современные постановки, ежегодный фестиваль оперного искусства.", hours: "касса 10:00–19:00", website: "https://chelopera.ru", image: wm("Chelyabinsk Opera and Ballet Theatre.jpg"), free: false },
  { id: "aloe-pole", name: "Сквер Алое Поле", category: "park", district: "Центральный", lat: 55.1656, lng: 61.4048, address: "ул. Красная", description: "Исторический сквер с мавзолеем Ленина и храмом Александра Невского.", history: "Название — после кровавых событий 1905 года.", details: "Памятник «Орлёнок», аллея пионеров, храм Александра Невского (архитектор А. Померанцев).", hours: "круглосуточно", image: wm("Aloe Pole Chelyabinsk.jpg"), free: true },
  { id: "arena-traktor", name: "Арена «Трактор» им. В. К. Белоусова", category: "sport", district: "Тракторозаводский", lat: 55.1717, lng: 61.4361, address: "ул. 250-летия Челябинска, 38", description: "Домашняя арена ХК «Трактор». Матчи КХЛ, концерты, шоу.", history: "Открыта в 2009 году. С 2016 носит имя тренера-легенды В. К. Белоусова.", details: "Вместимость 7500. Здесь проходят матчи КХЛ, гастроли мировых звёзд и городские церемонии.", website: "https://arenatraktor.ru", image: wm("Traktor Arena.jpg"), free: false },
  { id: "pushkin-park", name: "Городской сад им. А. С. Пушкина", category: "park", district: "Центральный", lat: 55.1652, lng: 61.3959, address: "ул. Свободы, 66", description: "Уютный сад в центре: беседки, скамейки, летняя эстрада.", history: "Основан в 1908 году к столетию поэта.", details: "Один из старейших парков города. Летом здесь работают открытые лекции, свинг-вечера и городская библиотека.", hours: "круглосуточно", image: unsp("photo-1508739773434-c26b3d09e071"), free: true },
  { id: "miass-embankment", name: "Набережная реки Миасс", category: "leisure", district: "Центральный", lat: 55.1636, lng: 61.4001, address: "наб. реки Миасс", description: "Обновлённая набережная — прогулки, велодорожки, виды на центр.", history: "Комплексная реконструкция завершена в 2020-х годах в рамках федеральной программы «Формирование комфортной городской среды».", details: "Пешеходно-велосипедный маршрут от концертного зала им. Прокофьева до Свердловского проспекта, летняя сцена, световая иллюминация.", hours: "круглосуточно", image: unsp("photo-1502920917128-1aa500764cbd"), free: true },
  { id: "geology-museum", name: "Геологический музей", category: "museum", district: "Центральный", lat: 55.1594, lng: 61.4021, address: "ул. Кирова, 70", description: "Коллекция уральских минералов и самоцветов.", details: "Более 10 000 образцов, ильменские топазы, малахит, метеориты, коллекция золота Урала.", hours: "10:00–17:00, вых. вс.-пн.", image: unsp("photo-1518998053901-5348d3961a04"), free: false },
  { id: "philharmonic", name: "Концертный зал им. С. С. Прокофьева", category: "music", district: "Центральный", lat: 55.1659, lng: 61.4041, address: "ул. Труда, 92А", description: "Главный концертный зал Челябинской филармонии.", history: "Открыт в 1985 году. Носит имя композитора С. С. Прокофьева.", details: "Академическая музыка, симфонические программы Челябинского филармонического оркестра, фестивали.", website: "https://philarmonia74.ru", image: unsp("photo-1465847899084-d164df4dedc6"), free: false },
  { id: "organ-hall", name: "Зал камерной и органной музыки", category: "music", district: "Центральный", lat: 55.1668, lng: 61.4046, address: "ул. Труда, 92А", description: "Один из немногих органных залов Урала.", history: "Открыт в 1987 году в здании бывшего Христорождественского собора.", details: "Немецкий орган фирмы «Ойле». Регулярные вечера органной, камерной и духовной музыки.", image: unsp("photo-1493225457124-a3eb161ffa5f"), free: false },
  { id: "drama-theatre", name: "Камерный театр", category: "theatre", district: "Центральный", lat: 55.1611, lng: 61.4062, address: "ул. Цвиллинга, 15", description: "Экспериментальный драматический театр.", details: "Малая сцена, современная драматургия, лабораторные проекты.", website: "https://chelkam.ru", image: unsp("photo-1503095396549-807759245b35"), free: false },
  { id: "youth-theatre", name: "Молодёжный театр (ТЮЗ)", category: "theatre", district: "Центральный", lat: 55.1595, lng: 61.4048, address: "ул. Кирова, 116", description: "Театр для детей и молодёжи.", history: "Основан в 1965 году.", details: "Классика и современные пьесы, специальные программы для школьников, лаборатории молодых режиссёров.", image: unsp("photo-1503095396549-807759245b35"), free: false },
  { id: "orlyonok-theatre", name: "Театр «Манекен»", category: "theatre", district: "Центральный", lat: 55.1620, lng: 61.4045, address: "ул. Пушкина, 64", description: "Легендарный студенческий театр ЮУрГУ.", history: "Основан в 1963 году. Один из старейших студенческих театров России.", details: "Экспериментальные постановки, поэтические вечера, международные фестивали.", image: unsp("photo-1503095396549-807759245b35"), free: false },
  { id: "puppet-theatre", name: "Театр кукол им. В. Вольховского", category: "theatre", district: "Центральный", lat: 55.1631, lng: 61.4056, address: "ул. Кирова, 8", description: "Один из лучших театров кукол России.", history: "Основан в 1935 году. Носит имя режиссёра Валерия Вольховского.", details: "Обладатель «Золотой Маски». Спектакли для семейного просмотра.", image: unsp("photo-1503095396549-807759245b35"), free: false },
  { id: "art-museum", name: "Челябинский музей изобразительных искусств", category: "gallery", district: "Центральный", lat: 55.1610, lng: 61.4076, address: "пл. Революции, 1", description: "Один из крупнейших художественных музеев Урала.", history: "Основан в 1940 году.", details: "Русское искусство XVIII–XX вв., советская живопись, декоративно-прикладное искусство, каслинское литьё.", website: "https://chelmusart.ru", image: unsp("photo-1541961017774-22349e4a1262"), free: false },
  { id: "svobody-64", name: "Дом-музей купцов Покровских", category: "museum", district: "Центральный", lat: 55.1594, lng: 61.4004, address: "ул. Свободы, 64", description: "Купеческая усадьба конца XIX века.", details: "Интерьеры, быт и предпринимательство дореволюционного Челябинска.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: false },
  { id: "alexander-nevsky", name: "Храм Александра Невского", category: "religion", district: "Центральный", lat: 55.1656, lng: 61.4053, address: "Алое поле", description: "Памятник архитектуры начала XX века.", history: "Построен в 1907–1911 гг. по проекту А. Померанцева.", details: "После реставрации возвращён Русской православной церкви. Внутри сохранились фрагменты росписей.", image: unsp("photo-1519681393784-d120267933ba"), free: true },
  { id: "trinity-cathedral", name: "Свято-Троицкая церковь", category: "religion", district: "Центральный", lat: 55.1596, lng: 61.3898, address: "ул. Кыштымская, 32", description: "Один из старейших храмов города.", history: "Освящён в 1914 году.", image: unsp("photo-1519681393784-d120267933ba"), free: true },
  { id: "mosque-akmechet", name: "Ак-Мечеть (Белая мечеть)", category: "religion", district: "Центральный", lat: 55.1526, lng: 61.4278, address: "ул. Елькина, 16", description: "Старейшая мечеть города.", history: "Построена в 1899 году.", image: unsp("photo-1519681393784-d120267933ba"), free: true },
  { id: "kurchatov-monument", name: "Памятник И. В. Курчатову", category: "monument", district: "Центральный", lat: 55.1601, lng: 61.3711, address: "просп. Ленина", description: "Символ послевоенного научного Челябинска.", history: "Открыт в 1986 году к 250-летию города.", details: "Скульптурная композиция «Расщепление атома» высотой 27 м — одна из открыток Челябинска.", image: unsp("photo-1451187580459-43490279c0fa"), free: true },
  { id: "camel-monument", name: "Памятник «Сказ об Урале»", category: "monument", district: "Советский", lat: 55.1518, lng: 61.4021, address: "Привокзальная площадь", description: "Богатырь-хранитель Урала у железнодорожного вокзала.", history: "Открыт в 1967 году. Скульптор Виталий Зайков.", details: "Высота 12 м. Один из символов города, встречает всех прибывающих поездами.", image: unsp("photo-1508672019048-805c876b67e2"), free: true },
  { id: "camel-boy", name: "Скульптура «Мальчик с верблюдом»", category: "monument", district: "Центральный", lat: 55.1614, lng: 61.3993, address: "Кировка", description: "Один из символов Челябинска — верблюд с герба города.", details: "Верблюд напоминает: город стоял на караванных путях в Азию.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: true },
  { id: "kurchatov-square", name: "Площадь Науки (ЮУрГУ)", category: "landmark", district: "Центральный", lat: 55.1601, lng: 61.3711, address: "просп. Ленина, 76", description: "Ансамбль главного корпуса ЮУрГУ с колесницей и Курчатовым.", history: "Реконструирована в 2004 году. Главный корпус ЮУрГУ увенчан скульптурами «Прометея» и «Ники».", image: unsp("photo-1451187580459-43490279c0fa"), free: true },
  { id: "student-park", name: "Парк ЮУрГУ (Студенческий)", category: "park", district: "Центральный", lat: 55.1591, lng: 61.3688, address: "просп. Ленина, 76", description: "Парк у главного корпуса ЮУрГУ.", details: "Прогулочная зона с фонтанами и памятником Курчатову.", hours: "круглосуточно", image: unsp("photo-1441974231531-c6227db76b6e"), free: true },
  { id: "chelmet", name: "Дворец культуры ЧМК", category: "landmark", district: "Металлургический", lat: 55.2611, lng: 61.4308, address: "ул. Богдана Хмельницкого, 5", description: "Памятник архитектуры сталинского ампира.", history: "Построен в 1950-х для металлургов Челябинска.", details: "Один из крупнейших ДК Урала, культурный центр Металлургического района.", image: unsp("photo-1503095396549-807759245b35"), free: true },
  { id: "znamya-cinema", name: "Кинотеатр «Знамя»", category: "landmark", district: "Центральный", lat: 55.1611, lng: 61.4041, address: "ул. Кирова, 112", description: "Исторический кинотеатр в центре.", history: "Открыт в 1937 году, реконструирован в 2010-х.", image: unsp("photo-1489599735734-79b4169c2a78"), free: false },
  { id: "kirov-bridge", name: "Мост через Миасс на Кировке", category: "landmark", district: "Центральный", lat: 55.1633, lng: 61.4006, address: "ул. Кирова", description: "Пешеходный мост с видом на исторический центр.", details: "Соединяет две части пешеходной Кировки. Отсюда открывается вид на «Челябинск-Сити» и три башни Исторического музея.", image: unsp("photo-1502920917128-1aa500764cbd"), free: true },
  { id: "chelyabinsk-city", name: "Небоскрёб «Челябинск-Сити»", category: "landmark", district: "Центральный", lat: 55.1636, lng: 61.4038, address: "ул. Кирова, 159", description: "Самое высокое здание города — 112 м.", history: "Построено в 2007 году. 24 этажа.", image: unsp("photo-1508672019048-805c876b67e2"), free: false },
  { id: "yeltsin-street", name: "Улица Труда (историческая)", category: "landmark", district: "Центральный", lat: 55.1607, lng: 61.4066, address: "ул. Труда", description: "Старейшая улица города — бывшая Сибирская.", details: "Купеческие особняки XIX века, музеи, набережная.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: true },
  { id: "public-library", name: "Челябинская областная универсальная библиотека", category: "library", district: "Центральный", lat: 55.1665, lng: 61.4009, address: "просп. Ленина, 60", description: "Главная библиотека региона — «Публичка».", history: "Основана в 1898 году. Более 2 млн изданий.", details: "Читальные залы, редкие книги, лекции, книжные клубы.", website: "https://chelreglib.ru", image: unsp("photo-1524578271613-d550eacf6090"), free: true },
  { id: "children-library", name: "Челябинская областная детская библиотека им. Маяковского", category: "library", district: "Центральный", lat: 55.1642, lng: 61.4023, address: "ул. Коммуны, 69", description: "Главная детская библиотека региона.", image: unsp("photo-1481627834876-b7833e8f5570"), free: true },
  { id: "traktor-park", name: "Парк «Тракторозаводский»", category: "park", district: "Тракторозаводский", lat: 55.1720, lng: 61.4552, address: "ул. Марченко", description: "Соседский парк на востоке города.", image: unsp("photo-1441974231531-c6227db76b6e"), free: true },
  { id: "revolyucii-park", name: "Сквер у Челябинского цирка", category: "park", district: "Центральный", lat: 55.1567, lng: 61.4015, address: "ул. Кирова, 25", description: "Зелёная зона у цирка с фонтаном.", image: unsp("photo-1508739773434-c26b3d09e071"), free: true },
  { id: "circus", name: "Челябинский государственный цирк", category: "leisure", district: "Центральный", lat: 55.1568, lng: 61.4021, address: "ул. Кирова, 25", description: "Крупнейший цирк Урала.", history: "Здание — 1979 года постройки.", details: "Круглогодичный репертуар, гастроли ведущих цирков России и мира.", website: "https://chel.circusrf.ru", image: unsp("photo-1585699324551-f6c309eedeca"), free: false },
  { id: "smolino-lake", name: "Озеро Смолино", category: "leisure", district: "Ленинский", lat: 55.0928, lng: 61.4133, address: "юго-восток города", description: "Городское солёное озеро с пляжами.", details: "Летом — плавание, виндсёрфинг; круглый год — прогулки по берегу.", image: unsp("photo-1502920917128-1aa500764cbd"), free: true },
  { id: "shershny", name: "Шершнёвское водохранилище", category: "leisure", district: "Советский", lat: 55.0722, lng: 61.3175, address: "юго-запад города", description: "Главный источник воды и место отдыха горожан.", details: "Пляжи, яхт-клубы, велодорожки, зимой — прогулки на коньках.", image: unsp("photo-1502920917128-1aa500764cbd"), free: true },
  { id: "botanical-garden", name: "Ботанический сад ЧелГУ", category: "park", district: "Калининский", lat: 55.1841, lng: 61.3639, address: "ул. Молодогвардейцев, 70Б", description: "Живая коллекция растений Урала и мира.", details: "Оранжереи, экскурсии, ботанические занятия для детей.", image: unsp("photo-1441974231531-c6227db76b6e"), free: false },
  { id: "airport-old", name: "Часовня во имя Св. Александра Невского", category: "religion", district: "Центральный", lat: 55.1651, lng: 61.4038, address: "Алое поле", description: "Небольшая часовня в сквере Алое поле.", image: unsp("photo-1519681393784-d120267933ba"), free: true },
  { id: "spartak-stadium", name: "Стадион «Центральный»", category: "sport", district: "Центральный", lat: 55.1580, lng: 61.3939, address: "ул. Коммуны, 98", description: "Главный футбольный стадион Челябинска.", history: "Построен в 1935 году.", image: unsp("photo-1518611012118-696072aa579a"), free: false },
  { id: "traktor-ice", name: "Ледовый дворец «Уральская молния»", category: "sport", district: "Курчатовский", lat: 55.2011, lng: 61.3466, address: "ул. Молодогвардейцев, 76А", description: "Дворец конькобежного спорта.", history: "Построен к 2004 году. Здесь тренировалась Светлана Журова.", image: unsp("photo-1515263487990-61b07816b324"), free: false },
  { id: "traktor-ski", name: "Лыжная база «Локомотив»", category: "sport", district: "Курчатовский", lat: 55.1998, lng: 61.3311, address: "ул. Молодогвардейцев, 78", description: "База зимних видов спорта.", image: unsp("photo-1517649763962-0c623066013b"), free: true },
  { id: "chernov-house", name: "Дом Черновых", category: "landmark", district: "Центральный", lat: 55.1633, lng: 61.4054, address: "ул. Труда, 66", description: "Купеческий особняк конца XIX века.", history: "Памятник архитектуры регионального значения.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: true },
  { id: "yushkov-house", name: "Дом Юшкова", category: "landmark", district: "Центральный", lat: 55.1636, lng: 61.4068, address: "ул. Труда, 82", description: "Особняк рубежа XIX–XX вв.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: true },
  { id: "meteorite-lake", name: "Озеро Чебаркуль (падение метеорита)", category: "landmark", district: "Центральный", lat: 55.0000, lng: 60.3833, address: "г. Чебаркуль, 80 км от Челябинска", description: "Куда упал челябинский метеорит 15 февраля 2013 года.", details: "Знаковая точка для науки и туризма. Осколки хранятся в Историческом музее Южного Урала.", image: unsp("photo-1462332420958-a05d1e002413"), free: true },
  { id: "smart-park", name: "Парк «Плодушка»", category: "park", district: "Тракторозаводский", lat: 55.1747, lng: 61.4432, address: "ул. Артиллерийская", description: "Обновлённый парк ЧТЗ.", image: unsp("photo-1508739773434-c26b3d09e071"), free: true },
  { id: "koltsevaya", name: "Челябинский краеведческий центр «Аркаим»", category: "museum", district: "Центральный", lat: 55.1615, lng: 61.4079, address: "ул. Труда, 100", description: "Филиал музея-заповедника Аркаим.", details: "Экспозиция о протогороде бронзового века (III–II тыс. до н. э.).", image: unsp("photo-1518998053901-5348d3961a04"), free: false },
  { id: "monument-warriors", name: "Мемориал «Скорбящие матери»", category: "monument", district: "Центральный", lat: 55.1591, lng: 61.4187, address: "Лесное кладбище", description: "Мемориал воинам-интернационалистам.", image: unsp("photo-1508672019048-805c876b67e2"), free: true },
  { id: "monument-tanks", name: "Памятник «Танкистам-добровольцам»", category: "monument", district: "Центральный", lat: 55.1618, lng: 61.4032, address: "бул. Славы", description: "Дань Танкограду — Челябинску военных лет.", history: "Открыт в 1975 году к 30-летию Победы.", details: "Символ трудового подвига челябинцев, выпускавших Т-34, КВ и ИС на ЧТЗ.", image: unsp("photo-1451187580459-43490279c0fa"), free: true },
  { id: "monument-love", name: "Памятник Влюблённым", category: "monument", district: "Центральный", lat: 55.1633, lng: 61.4008, address: "мост Кировки", description: "Скульптурная композиция на мосту Кировки.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: true },
  { id: "monument-cabbie", name: "Скульптура «Извозчик»", category: "monument", district: "Центральный", lat: 55.1614, lng: 61.4002, address: "Кировка", description: "Бронзовый извозчик — одна из скульптур пешеходной улицы.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: true },
  { id: "monument-nishchij", name: "Скульптура «Нищий»", category: "monument", district: "Центральный", lat: 55.1611, lng: 61.4009, address: "Кировка", description: "Одна из самых узнаваемых скульптур Кировки.", details: "По поверью, если положить монетку — вернётся сторицей.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: true },
  { id: "monument-modnica", name: "Скульптура «Модница у зеркала»", category: "monument", district: "Центральный", lat: 55.1613, lng: 61.4010, address: "Кировка", description: "Бронзовая композиция на пешеходной улице.", image: unsp("photo-1524231757912-21f4fe3a7200"), free: true },
  { id: "monument-clown", name: "Скульптура «Клоун»", category: "monument", district: "Центральный", lat: 55.1568, lng: 61.4020, address: "у цирка", description: "Клоун-приглашение у Челябинского цирка.", image: unsp("photo-1585699324551-f6c309eedeca"), free: true },
  { id: "gallery-okno", name: "Галерея современного искусства «Окно»", category: "gallery", district: "Центральный", lat: 55.1631, lng: 61.4021, address: "ул. Кирова, 88", description: "Площадка современного уральского искусства.", image: unsp("photo-1541961017774-22349e4a1262"), free: false },
  { id: "gallery-otkritka", name: "Галерея «ОкNo»", category: "gallery", district: "Центральный", lat: 55.1634, lng: 61.4029, address: "ул. Кирова, 82", description: "Современные художники Урала и России.", image: unsp("photo-1541961017774-22349e4a1262"), free: false },
  { id: "arb-museum", name: "Музей-театр «АРТиШОК»", category: "gallery", district: "Центральный", lat: 55.1621, lng: 61.4055, address: "ул. Пушкина, 60", description: "Малая сцена современного искусства.", image: unsp("photo-1541961017774-22349e4a1262"), free: false },
  { id: "tsibulya", name: "Сад-остров Троицкий", category: "park", district: "Ленинский", lat: 55.1362, lng: 61.4302, address: "р-н ул. Троицкой", description: "Небольшой городской остров-парк.", image: unsp("photo-1508739773434-c26b3d09e071"), free: true },
  { id: "revs-square", name: "Театральный сквер", category: "park", district: "Центральный", lat: 55.1620, lng: 61.4032, address: "у Театра оперы и балета", description: "Сквер с фонтанами перед театром.", image: unsp("photo-1441974231531-c6227db76b6e"), free: true },
];

// Оставляем локальные события как fallback / демо; основной поток — из Kudago (см. src/lib/kudago.functions.ts)
export type EventCategory = "concert" | "theater" | "exhibition" | "cinema" | "kids" | "sport" | "festival" | "education" | "other";

export const EVENT_CATEGORY_LABEL: Record<EventCategory, string> = {
  concert: "Концерты",
  theater: "Театр",
  exhibition: "Выставки",
  cinema: "Кино",
  kids: "Детям",
  sport: "Спорт",
  festival: "Фестивали",
  education: "Лекции",
  other: "Другое",
};

export interface CityEvent {
  id: string;
  title: string;
  category: EventCategory;
  dates: { start: string; end?: string }[];
  venue: string;
  address?: string;
  lat?: number;
  lng?: number;
  price: { min: number; max?: number; isFree: boolean; text?: string };
  ageRestriction?: string;
  description: string;
  image: string;
  ticketUrl?: string;
  source: "local" | "kudago";
}
