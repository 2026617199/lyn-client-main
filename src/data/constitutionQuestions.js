/**
 * 体质测试题目数据
 * 基于中医体质理论设计的标准化问题
 */

const CONSTITUTION_KEYS = [
  'balanced',
  'qi_deficiency',
  'yang_deficiency',
  'yin_deficiency',
  'phlegm_dampness',
  'damp_heat',
  'blood_stasis',
  'qi_stagnation',
  'special'
]

const symptomQuestion = (id, question, targetTypes, category, weight = 1) => {
  const score = Object.fromEntries(targetTypes.map(type => [type, 3]))
  const lightScore = Object.fromEntries(targetTypes.map(type => [type, 1]))

  return {
    id,
    question,
    targetTypes,
    category,
    weight,
    options: [
      { text: '几乎没有', scores: { balanced: 2 } },
      { text: '偶尔出现', scores: lightScore },
      { text: '经常出现', scores: score },
      { text: '非常明显，已影响日常生活', scores: Object.fromEntries(targetTypes.map(type => [type, 4])) }
    ]
  }
}

const choiceQuestion = (id, question, category, options, weight = 2) => ({
  id,
  question,
  targetTypes: [...new Set(options.flatMap(option => Object.keys(option.scores)))],
  category,
  weight,
  options
})

export const constitutionQuestions = [
  choiceQuestion(1, '您的体力状况如何？', 'core', [
    { text: '精力充沛，不易疲劳', scores: { balanced: 3, yang_deficiency: -1, yin_deficiency: -1 } },
    { text: '容易疲劳，稍微活动就气喘', scores: { qi_deficiency: 3, yang_deficiency: 2 } },
    { text: '体力一般，但容易倦怠', scores: { qi_deficiency: 2, phlegm_dampness: 1 } },
    { text: '时好时坏，不稳定', scores: { qi_stagnation: 2, special: 1 } }
  ], 4),
  choiceQuestion(2, '您对冷热的敏感程度如何？', 'core', [
    { text: '怕冷，手脚冰凉', scores: { yang_deficiency: 3, qi_deficiency: 2 } },
    { text: '怕热，容易出汗', scores: { yin_deficiency: 3, damp_heat: 2 } },
    { text: '冷热都能适应', scores: { balanced: 3 } },
    { text: '既怕冷又怕热', scores: { qi_deficiency: 2, yin_deficiency: 2, special: 1 } }
  ], 4),
  choiceQuestion(3, '您的面色通常如何？', 'core', [
    { text: '红润有光泽', scores: { balanced: 3 } },
    { text: '面色苍白或萎黄', scores: { qi_deficiency: 3, blood_stasis: 2 } },
    { text: '面色晦暗或有色斑', scores: { blood_stasis: 3, qi_stagnation: 2 } },
    { text: '面部油腻，易长痘', scores: { damp_heat: 3, phlegm_dampness: 2 } }
  ], 4),
  choiceQuestion(4, '您的体型特点更接近哪一种？', 'core', [
    { text: '体型匀称，体重适中', scores: { balanced: 3 } },
    { text: '体型偏瘦', scores: { yin_deficiency: 3, qi_deficiency: 2 } },
    { text: '体型偏胖，肌肉松软', scores: { phlegm_dampness: 3, yang_deficiency: 2 } },
    { text: '肥胖且结实，易上火油腻', scores: { damp_heat: 2, phlegm_dampness: 2 } }
  ], 4),
  choiceQuestion(5, '您的消化系统状况如何？', 'core', [
    { text: '消化良好，食欲正常', scores: { balanced: 3 } },
    { text: '食欲不振，易腹胀', scores: { qi_deficiency: 3, phlegm_dampness: 2 } },
    { text: '易饥饿，口干喜冷饮', scores: { yin_deficiency: 3, damp_heat: 2 } },
    { text: '大便溏薄或粘滞', scores: { phlegm_dampness: 3, qi_deficiency: 1 } }
  ], 4),
  choiceQuestion(6, '您的情绪状态通常如何？', 'core', [
    { text: '情绪稳定，心情舒畅', scores: { balanced: 3 } },
    { text: '容易焦虑，思虑过多', scores: { qi_stagnation: 3, yin_deficiency: 2 } },
    { text: '情绪波动大，易怒', scores: { qi_stagnation: 2, damp_heat: 2 } },
    { text: '情绪低落，易抑郁', scores: { qi_stagnation: 3, blood_stasis: 1 } }
  ], 4),
  choiceQuestion(7, '您的睡眠质量如何？', 'core', [
    { text: '睡眠很好，醒后精力恢复', scores: { balanced: 3 } },
    { text: '入睡困难，多梦易醒', scores: { yin_deficiency: 3, qi_stagnation: 2 } },
    { text: '嗜睡，但醒来仍疲劳', scores: { phlegm_dampness: 3, qi_deficiency: 2 } },
    { text: '睡眠不安宁，易惊醒', scores: { qi_deficiency: 2, yang_deficiency: 2 } }
  ], 4),
  choiceQuestion(8, '您的舌象通常更接近哪一种？', 'core', [
    { text: '淡红舌，薄白苔', scores: { balanced: 3 } },
    { text: '舌淡胖，边有齿痕', scores: { qi_deficiency: 3, yang_deficiency: 2, phlegm_dampness: 1 } },
    { text: '红舌，少苔或无苔', scores: { yin_deficiency: 3, damp_heat: 2 } },
    { text: '舌暗红、有瘀点或苔厚腻', scores: { blood_stasis: 3, phlegm_dampness: 2, damp_heat: 2 } }
  ], 4),
  choiceQuestion(9, '您容易出汗吗？', 'core', [
    { text: '正常出汗', scores: { balanced: 3 } },
    { text: '易自汗，稍动即汗', scores: { qi_deficiency: 3, yang_deficiency: 2 } },
    { text: '盗汗，夜间易汗', scores: { yin_deficiency: 3 } },
    { text: '汗黏或汗味重', scores: { damp_heat: 3, phlegm_dampness: 2 } }
  ], 4),
  choiceQuestion(10, '您是否容易过敏？', 'core', [
    { text: '很少过敏', scores: { balanced: 2 } },
    { text: '易鼻炎、皮肤过敏', scores: { special: 3, yin_deficiency: 1 } },
    { text: '季节性过敏明显', scores: { special: 2, qi_deficiency: 1 } },
    { text: '对多种物质过敏', scores: { special: 4 } }
  ], 4),
  symptomQuestion(11, '您是否经常气短、说话声音低弱？', ['qi_deficiency'], 'energy', 3),
  symptomQuestion(12, '您是否稍微活动就觉得累？', ['qi_deficiency'], 'energy', 3),
  symptomQuestion(13, '您是否容易反复感冒或恢复较慢？', ['qi_deficiency', 'special'], 'immunity', 2),
  symptomQuestion(14, '您是否常觉得精神不振、懒得说话？', ['qi_deficiency'], 'energy', 2),
  symptomQuestion(15, '您是否饭后容易困倦？', ['qi_deficiency', 'phlegm_dampness'], 'digestion', 2),
  symptomQuestion(16, '您是否容易头晕目眩？', ['qi_deficiency', 'blood_stasis'], 'head', 2),
  symptomQuestion(17, '您是否肌肉松软、不够结实？', ['qi_deficiency', 'phlegm_dampness'], 'body', 2),
  symptomQuestion(18, '您是否容易心慌或心跳不安？', ['qi_deficiency', 'yin_deficiency'], 'sleep', 2),
  symptomQuestion(19, '您是否容易自汗，安静时也出汗？', ['qi_deficiency'], 'sweat', 3),
  symptomQuestion(20, '您是否工作学习一久就明显乏力？', ['qi_deficiency'], 'energy', 2),
  symptomQuestion(21, '您是否手脚经常发凉？', ['yang_deficiency'], 'cold_heat', 3),
  symptomQuestion(22, '您是否比别人更怕冷、衣服穿得更多？', ['yang_deficiency'], 'cold_heat', 3),
  symptomQuestion(23, '您是否喜欢热饮热食，不喜欢冷饮？', ['yang_deficiency'], 'diet', 2),
  symptomQuestion(24, '您是否腹部或腰膝容易发凉？', ['yang_deficiency'], 'cold_heat', 3),
  symptomQuestion(25, '您是否清晨容易腹泻或大便偏稀？', ['yang_deficiency', 'qi_deficiency'], 'stool', 3),
  symptomQuestion(26, '您是否面色偏白、缺少血色？', ['yang_deficiency', 'qi_deficiency'], 'complexion', 2),
  symptomQuestion(27, '您是否精神状态偏沉、不爱活动？', ['yang_deficiency', 'qi_deficiency'], 'energy', 2),
  symptomQuestion(28, '您是否在空调房或阴雨天不舒服？', ['yang_deficiency'], 'environment', 2),
  symptomQuestion(29, '您是否小便清长、夜尿偏多？', ['yang_deficiency'], 'urine', 2),
  symptomQuestion(30, '您是否冬季症状明显加重？', ['yang_deficiency'], 'season', 2),
  symptomQuestion(31, '您是否常感到手心脚心发热？', ['yin_deficiency'], 'cold_heat', 3),
  symptomQuestion(32, '您是否口干咽燥，尤其下午或夜间明显？', ['yin_deficiency'], 'mouth', 3),
  symptomQuestion(33, '您是否容易潮热、脸部烘热？', ['yin_deficiency'], 'cold_heat', 3),
  symptomQuestion(34, '您是否夜间睡觉容易出汗？', ['yin_deficiency'], 'sweat', 3),
  symptomQuestion(35, '您是否大便偏干或排便费力？', ['yin_deficiency', 'damp_heat'], 'stool', 2),
  symptomQuestion(36, '您是否皮肤或嘴唇容易干燥？', ['yin_deficiency'], 'skin', 2),
  symptomQuestion(37, '您是否眼睛干涩、用眼后不适？', ['yin_deficiency'], 'head', 2),
  symptomQuestion(38, '您是否睡眠浅、多梦、易醒？', ['yin_deficiency', 'qi_stagnation'], 'sleep', 2),
  symptomQuestion(39, '您是否偏爱冷饮或凉性食物？', ['yin_deficiency', 'damp_heat'], 'diet', 2),
  symptomQuestion(40, '您是否容易烦热、心里不安？', ['yin_deficiency', 'qi_stagnation'], 'emotion', 2),
  symptomQuestion(41, '您是否体型偏胖或腹部肥满？', ['phlegm_dampness'], 'body', 3),
  symptomQuestion(42, '您是否经常感觉身体沉重困倦？', ['phlegm_dampness'], 'energy', 3),
  symptomQuestion(43, '您是否口中发黏或口甜？', ['phlegm_dampness'], 'mouth', 3),
  symptomQuestion(44, '您是否痰多、咽喉有痰感？', ['phlegm_dampness'], 'respiration', 3),
  symptomQuestion(45, '您是否胸闷或腹部胀满？', ['phlegm_dampness', 'qi_stagnation'], 'digestion', 2),
  symptomQuestion(46, '您是否面部皮肤油脂较多？', ['phlegm_dampness', 'damp_heat'], 'skin', 2),
  symptomQuestion(47, '您是否舌苔厚腻？', ['phlegm_dampness', 'damp_heat'], 'tongue', 3),
  symptomQuestion(48, '您是否不喜欢潮湿闷热环境？', ['phlegm_dampness', 'damp_heat'], 'environment', 2),
  symptomQuestion(49, '您是否容易水肿或眼睑浮肿？', ['phlegm_dampness', 'yang_deficiency'], 'body', 2),
  symptomQuestion(50, '您是否吃甜食、油腻后更容易不舒服？', ['phlegm_dampness'], 'diet', 2),
  symptomQuestion(51, '您是否面部油光、容易长痘？', ['damp_heat'], 'skin', 3),
  symptomQuestion(52, '您是否口苦、口干或口气较重？', ['damp_heat'], 'mouth', 3),
  symptomQuestion(53, '您是否大便黏滞、不爽或有排不尽感？', ['damp_heat', 'phlegm_dampness'], 'stool', 3),
  symptomQuestion(54, '您是否小便颜色偏黄、气味较重？', ['damp_heat'], 'urine', 3),
  symptomQuestion(55, '您是否容易皮肤瘙痒、湿疹或疮疖？', ['damp_heat', 'special'], 'skin', 2),
  symptomQuestion(56, '您是否容易急躁、发火？', ['damp_heat', 'qi_stagnation'], 'emotion', 2),
  symptomQuestion(57, '您是否喜欢辛辣油炸后症状加重？', ['damp_heat'], 'diet', 2),
  symptomQuestion(58, '您是否经常觉得身热但又沉重？', ['damp_heat', 'phlegm_dampness'], 'cold_heat', 2),
  symptomQuestion(59, '您是否舌苔黄腻？', ['damp_heat'], 'tongue', 3),
  symptomQuestion(60, '您是否在夏季湿热天气明显不适？', ['damp_heat'], 'season', 2),
  symptomQuestion(61, '您是否肤色晦暗或有色斑？', ['blood_stasis'], 'complexion', 3),
  symptomQuestion(62, '您是否口唇颜色偏暗或发紫？', ['blood_stasis'], 'complexion', 3),
  symptomQuestion(63, '您是否身体某处经常有固定刺痛？', ['blood_stasis'], 'pain', 3),
  symptomQuestion(64, '您是否容易出现瘀青，恢复较慢？', ['blood_stasis'], 'skin', 3),
  symptomQuestion(65, '您是否舌质偏暗或有瘀点？', ['blood_stasis'], 'tongue', 3),
  symptomQuestion(66, '您是否记忆力下降或容易健忘？', ['blood_stasis', 'qi_deficiency'], 'head', 2),
  symptomQuestion(67, '您是否眼眶暗、黑眼圈明显？', ['blood_stasis'], 'complexion', 2),
  symptomQuestion(68, '女性是否经期血块多或痛经明显？男性可选择“几乎没有”。', ['blood_stasis', 'qi_stagnation'], 'pain', 2),
  symptomQuestion(69, '您是否久坐少动后身体僵硬不适？', ['blood_stasis', 'phlegm_dampness'], 'body', 2),
  symptomQuestion(70, '您是否局部麻木、针刺感或循环不畅感？', ['blood_stasis'], 'pain', 2),
  symptomQuestion(71, '您是否经常胸闷、爱叹气？', ['qi_stagnation'], 'emotion', 3),
  symptomQuestion(72, '您是否容易情绪低落或多愁善感？', ['qi_stagnation'], 'emotion', 3),
  symptomQuestion(73, '您是否紧张焦虑时胃口或消化受影响？', ['qi_stagnation'], 'digestion', 3),
  symptomQuestion(74, '您是否咽喉常有异物感，吞不下吐不出？', ['qi_stagnation'], 'respiration', 3),
  symptomQuestion(75, '您是否胁肋、乳房或腹部胀痛？', ['qi_stagnation', 'blood_stasis'], 'pain', 2),
  symptomQuestion(76, '您是否遇事容易紧张、压力难以排解？', ['qi_stagnation'], 'emotion', 2),
  symptomQuestion(77, '您是否睡前容易反复思考，难以放松？', ['qi_stagnation', 'yin_deficiency'], 'sleep', 2),
  symptomQuestion(78, '您是否经常嗳气、打嗝或腹胀？', ['qi_stagnation', 'phlegm_dampness'], 'digestion', 2),
  symptomQuestion(79, '您是否对季节、环境变化导致情绪波动明显？', ['qi_stagnation', 'special'], 'environment', 2),
  symptomQuestion(80, '您是否长期感觉不舒展、胸腹憋闷？', ['qi_stagnation'], 'emotion', 2),
  symptomQuestion(81, '您是否不感冒也经常鼻塞、打喷嚏？', ['special'], 'immunity', 3),
  symptomQuestion(82, '您是否接触花粉、尘螨或宠物后容易不适？', ['special'], 'allergy', 3),
  symptomQuestion(83, '您是否容易食物过敏或吃特定食物后皮疹腹泻？', ['special'], 'allergy', 3),
  symptomQuestion(84, '您是否皮肤容易起风团、荨麻疹？', ['special'], 'skin', 3),
  symptomQuestion(85, '您是否对药物、酒精或气味较敏感？', ['special'], 'allergy', 3),
  symptomQuestion(86, '您是否家族中有明显过敏史？', ['special'], 'allergy', 2),
  symptomQuestion(87, '您是否天气变化时容易咳嗽、喘或皮肤不适？', ['special', 'qi_deficiency'], 'environment', 2),
  symptomQuestion(88, '您是否容易对新的护肤品、洗涤剂起反应？', ['special'], 'skin', 2),
  symptomQuestion(89, '您是否从小体质敏感、适应环境较慢？', ['special', 'qi_deficiency'], 'immunity', 2),
  symptomQuestion(90, '您是否容易出现原因不明的皮肤红痒？', ['special', 'damp_heat'], 'skin', 2),
  symptomQuestion(91, '您是否大多数时间精力稳定、恢复快？', ['balanced'], 'balanced', 2),
  symptomQuestion(92, '您是否饮食睡眠规律且很少明显不适？', ['balanced'], 'balanced', 2),
  symptomQuestion(93, '您是否能较好适应冷热变化？', ['balanced'], 'balanced', 2),
  symptomQuestion(94, '您是否情绪平稳、压力后恢复较快？', ['balanced'], 'balanced', 2),
  symptomQuestion(95, '您是否很少腹胀、腹泻或便秘？', ['balanced'], 'balanced', 2),
  choiceQuestion(96, '当您疲劳时，最明显的表现是？', 'discriminator', [
    { text: '休息后很快恢复', scores: { balanced: 2 } },
    { text: '气短乏力、声音低', scores: { qi_deficiency: 3 } },
    { text: '怕冷、手脚凉', scores: { yang_deficiency: 3 } },
    { text: '身重困倦、头昏沉', scores: { phlegm_dampness: 3 } }
  ], 4),
  choiceQuestion(97, '当您上火或不适时，更常见的是？', 'discriminator', [
    { text: '很少明显上火', scores: { balanced: 2 } },
    { text: '口干咽燥、潮热盗汗', scores: { yin_deficiency: 3 } },
    { text: '口苦口黏、痘油光', scores: { damp_heat: 3 } },
    { text: '情绪郁闷、胸胁胀', scores: { qi_stagnation: 3 } }
  ], 4),
  choiceQuestion(98, '您的排便问题更接近哪一种？', 'discriminator', [
    { text: '基本正常', scores: { balanced: 2 } },
    { text: '偏稀、清晨明显', scores: { yang_deficiency: 3, qi_deficiency: 1 } },
    { text: '干结、排便费力', scores: { yin_deficiency: 3 } },
    { text: '黏滞不爽、味重', scores: { damp_heat: 3, phlegm_dampness: 2 } }
  ], 4),
  choiceQuestion(99, '皮肤状态更接近哪一种？', 'discriminator', [
    { text: '肤色润泽，问题较少', scores: { balanced: 2 } },
    { text: '干燥、缺水、易细纹', scores: { yin_deficiency: 3 } },
    { text: '油腻、痘、毛孔明显', scores: { damp_heat: 3, phlegm_dampness: 1 } },
    { text: '暗沉、色斑、瘀青', scores: { blood_stasis: 3 } }
  ], 4),
  choiceQuestion(100, '遇到环境变化时，您通常会？', 'discriminator', [
    { text: '适应较快，影响不大', scores: { balanced: 2 } },
    { text: '容易过敏、鼻痒喷嚏', scores: { special: 3 } },
    { text: '容易怕冷或腹泻', scores: { yang_deficiency: 3 } },
    { text: '容易烦躁、口苦或皮肤油痒', scores: { damp_heat: 2, qi_stagnation: 2 } }
  ], 4)
]

const shuffleQuestions = questions => {
  const result = [...questions]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const addUniqueQuestions = (target, candidates, count) => {
  const selectedIds = new Set(target.map(question => question.id))
  const available = shuffleQuestions(candidates).filter(question => !selectedIds.has(question.id))
  target.push(...available.slice(0, count))
}

/**
 * 生成一次 50 题问卷：保留核心筛查，按体质分层抽题，并补充鉴别题。
 * @param {Object} options
 * @param {number} options.count - 需要抽取的题目数量
 * @param {Array<string>} options.focusTypes - 可选，优先关注的体质类型
 * @returns {Array} 本次问卷题目
 */
export function generateQuestionnaireQuestions({ count = 50, focusTypes = [] } = {}) {
  const selected = []
  const validFocusTypes = focusTypes.filter(type => CONSTITUTION_KEYS.includes(type))

  addUniqueQuestions(selected, constitutionQuestions.filter(question => question.category === 'core'), 12)
  addUniqueQuestions(selected, constitutionQuestions.filter(question => question.category === 'discriminator'), 5)

  const targetTypes = validFocusTypes.length
    ? [...validFocusTypes, ...CONSTITUTION_KEYS.filter(type => !validFocusTypes.includes(type))]
    : CONSTITUTION_KEYS

  targetTypes.forEach(type => {
    const quota = validFocusTypes.includes(type) ? 5 : 3
    addUniqueQuestions(
      selected,
      constitutionQuestions.filter(question => question.targetTypes?.includes(type)),
      quota
    )
  })

  if (selected.length < count) {
    const highWeightQuestions = constitutionQuestions.filter(question => question.weight >= 3)
    addUniqueQuestions(selected, highWeightQuestions, count - selected.length)
  }

  if (selected.length < count) {
    addUniqueQuestions(selected, constitutionQuestions, count - selected.length)
  }

  return shuffleQuestions(selected).slice(0, count)
}

/**
 * 体质类型详细信息
 */
export const constitutionTypes = {
  balanced: {
    type: 'balanced',
    name: '平和质',
    description: '阴阳气血调和，体质状态较好',
    characteristics: [
      '体型匀称健壮',
      '面色润泽，头发稠密有光泽',
      '精力充沛，睡眠良好',
      '性格随和开朗',
      '患病较少，自身调节能力强',
      '适应能力强，能耐寒热'
    ],
    dietAdvice: ['饮食有节，不暴饮暴食', '粗细搭配，营养均衡', '适量运动，劳逸结合'],
    avoidFoods: []
  },
  qi_deficiency: {
    type: 'qi_deficiency',
    name: '气虚质',
    description: '元气不足，气息低弱',
    characteristics: [
      '语音低弱，气短懒言',
      '容易疲乏，精神不振',
      '易出虚汗',
      '舌淡红，舌体胖大，边有齿痕',
      '面色萎黄或淡白',
      '肌肉松软不实'
    ],
    dietAdvice: [
      '宜食补气健脾食物',
      '如：山药、莲子、大枣、小米',
      '忌食生冷油腻',
      '运动要适度，避免剧烈运动'
    ],
    avoidFoods: ['生冷食物', '油腻食物', '难消化食物']
  },
  yang_deficiency: {
    type: 'yang_deficiency',
    name: '阳虚质',
    description: '阳气不足，怕冷畏寒',
    characteristics: [
      '畏寒怕冷，手足不温',
      '喜热饮食，精神不振',
      '舌淡胖嫩，脉沉迟',
      '面色㿠白',
      '易腹泻',
      '性欲减退'
    ],
    dietAdvice: [
      '宜食温补食物',
      '如：羊肉、韭菜、生姜、桂圆',
      '忌食生冷寒凉',
      '注意保暖，适当运动'
    ],
    avoidFoods: ['生冷食物', '寒性水果', '冰镇饮品']
  },
  yin_deficiency: {
    type: 'yin_deficiency',
    name: '阴虚质',
    description: '阴液亏虚，燥热内盛',
    characteristics: [
      '手足心热，口燥咽干',
      '喜冷饮，大便干燥',
      '舌红少津，脉细数',
      '面色潮红，有烘热感',
      '易失眠',
      '皮肤干燥'
    ],
    dietAdvice: ['宜食滋阴润燥食物', '如：银耳、百合、梨、鸭肉', '忌食温燥食物', '保证充足睡眠'],
    avoidFoods: ['辛辣食物', '煎炸食物', '温补药物']
  },
  phlegm_dampness: {
    type: 'phlegm_dampness',
    name: '痰湿质',
    description: '痰湿凝聚，体型肥胖',
    characteristics: [
      '体型肥胖，腹部肥满',
      '面部皮肤油脂较多',
      '多汗且黏',
      '胸闷，痰多',
      '口黏腻或甜',
      '身重困倦'
    ],
    dietAdvice: [
      '宜食健脾祛湿食物',
      '如：薏米、赤小豆、冬瓜',
      '忌食肥甘厚味',
      '加强运动，控制体重'
    ],
    avoidFoods: ['甜食', '油腻食物', '酒类', '冷饮']
  },
  damp_heat: {
    type: 'damp_heat',
    name: '湿热质',
    description: '湿热内蕴，排泄不畅',
    characteristics: [
      '面垢油光，易生痤疮',
      '口苦口干，身重困倦',
      '大便黏滞不畅',
      '小便短赤',
      '男性阴囊潮湿，女性带下增多',
      '舌质偏红，苔黄腻'
    ],
    dietAdvice: ['宜食清热利湿食物', '如：绿豆、苦瓜、黄瓜', '忌食辛辣油腻', '保持皮肤清洁干燥'],
    avoidFoods: ['辛辣食物', '油腻食物', '酒类', '烧烤']
  },
  blood_stasis: {
    type: 'blood_stasis',
    name: '血瘀质',
    description: '血行不畅，易有瘀滞',
    characteristics: [
      '肤色晦暗，色素沉着',
      '易出现瘀斑',
      '口唇暗淡',
      '舌暗或有瘀点',
      '健忘',
      '女性多痛经'
    ],
    dietAdvice: [
      '宜食活血化瘀食物',
      '如：山楂、玫瑰花、红糖',
      '忌食寒凉',
      '适当运动，促进血液循环'
    ],
    avoidFoods: ['生冷食物', '寒性食物']
  },
  qi_stagnation: {
    type: 'qi_stagnation',
    name: '气郁质',
    description: '气机郁滞，情志不舒',
    characteristics: [
      '神情抑郁，忧虑脆弱',
      '多愁善感，情绪不稳',
      '胸闷，胁胀',
      '嗳气，善太息',
      '咽喉异物感',
      '女性乳房胀痛'
    ],
    dietAdvice: ['宜食疏肝理气食物', '如：柑橘、玫瑰花、茉莉花', '保持心情舒畅', '多参加集体活动'],
    avoidFoods: ['过饱饮食', '刺激性食物']
  },
  special: {
    type: 'special',
    name: '特禀质',
    description: '先天禀赋不足，易过敏',
    characteristics: [
      '易过敏',
      '不感冒也鼻塞打喷嚏',
      '易患药物过敏',
      '易患花粉症',
      '皮肤易起荨麻疹',
      '遗传性疾病'
    ],
    dietAdvice: ['饮食清淡，均衡营养', '避免已知过敏原', '增强体质，提高免疫力', '居住环境清洁'],
    avoidFoods: ['海鲜', '辛辣食物', '发物', '个人过敏原']
  }
}

/**
 * 计算体质测试结果
 * @param {Array} answers - 用户答案数组，每个元素包含 questionId 和 optionIndex
 * @returns {Object} 包含推荐体质和详细分数的对象
 */
export function calculateConstitution(answers, questions = constitutionQuestions) {
  const scores = {
    balanced: 0,
    qi_deficiency: 0,
    yang_deficiency: 0,
    yin_deficiency: 0,
    phlegm_dampness: 0,
    damp_heat: 0,
    blood_stasis: 0,
    qi_stagnation: 0,
    special: 0
  }

  // 计算每种体质的得分
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId)
    if (question && answer.optionIndex !== undefined) {
      const option = question.options[answer.optionIndex]
      if (option && option.scores) {
        Object.keys(option.scores).forEach(constitution => {
          scores[constitution] += option.scores[constitution] || 0
        })
      }
    }
  })

  // 找出得分最高的体质
  const maxScore = Math.max(...Object.values(scores))
  const recommendedConstitutions = Object.keys(scores).filter(key => scores[key] === maxScore)

  // 如果有多个最高分，默认选择第一个
  const recommendedType = recommendedConstitutions[0] || 'balanced'

  return {
    recommendedType,
    constitutionScores: scores,
    maxScore,
    constitutionDetails: constitutionTypes[recommendedType]
  }
}
