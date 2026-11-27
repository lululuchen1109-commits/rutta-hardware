(() => {
  const locales = ['en-US', 'zh-CN', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE'];
  const fallback = 'en-US';
  const copy = {
    'en-US': {
      metaTitle: 'Rutta R1 | Team decisions, kept in context',
      metaDescription: 'Rutta R1 keeps the small decisions that usually disappear after a conversation. Confirm what matters, then keep the next step with the team’s work.',
      language: 'Language',
      nav: ['Scenarios', 'How it works', 'Privacy', 'Hardware', 'Product gallery ↗', 'Contact us ↗'],
      cta: 'Join waitlist',
      hero: ['R1', 'Keep every team decision in context.', 'R1 keeps the small decisions that usually disappear after a conversation. The people who were there confirm what matters, then the next step stays with the team’s work.', 'Join the waitlist', 'See real scenarios', 'Keep work context moving.<br>Keep private time private.', 'R1 stays with your Mac from desk-side decisions to meeting-room handoffs. Participants confirm what should move forward, while the status light and physical mute keep the boundary clear.', 'Product gallery ↗'],
      principles: ['Capture the moment', 'Keep the circle clear', 'Make context usable', 'Most team context moves in the two minutes between meetings. R1 helps the right people turn that moment into a decision, an owner, and a next step.'],
      sections: {scenarios: 'The moments that move a team forward happen between meetings.', scenariosLead: 'R1 is for the moments between meetings: a desk-side decision, a handoff, a customer debrief, or a detail the next person needs to move forward.', workflow: 'From desk talk to team memory—with zero manual note-taking.', privacy: 'A work microphone with a clear boundary.', hardware: 'Small enough to disappear.<br>Clear enough to trust.', journal: 'Inside R1', faq: 'Start with the moments your team already has.'},
      form: {title: 'Tell us if your team needs R1.', body: 'We’re inviting teams to show us where spoken decisions get lost. Leave an email if you want to see the next R1 study, or describe the moment your team keeps having to reconstruct.', email: 'Work email *', scenario: 'Where would R1 help your team most?', choices: ['Desk-side decisions', 'Standup promises & handoffs', 'Post-meeting decisions', 'AI Agent context', 'Others'], other: 'Describe your scenario', otherPlaceholder: 'e.g. Client workshops, agency reviews, founder syncs', team: 'Team size (optional)', teamPlaceholder: 'Choose team size', notes: 'What would you want R1 to remember? (optional)', notesPlaceholder: 'Tell us about a decision, handoff, customer debrief, or team context you repeat today.', consent: 'Email me about R1 progress and optional 15-min concept chats.', privacy: 'Privacy Notice', submit: 'Join the waitlist ↗', note: 'A short note is enough. No purchase decision is needed.', thanks: 'You’re on the waitlist.'},
      hardware: {tabs: ['Finishes', 'Side fit', 'Mute', '3D view'], finish: 'R1 · Silver', fit: 'Slide to connect', switch: 'One physical switch', explore: 'Turn it around', intro: 'Drag to rotate, or choose a detail.', options: ['Inlets', 'USB-C', 'Switch'], reset: 'Reset'},
      footer: ['Product', 'Engineering', 'Validation', 'Back to top ↑']
    },
    'zh-CN': {
      metaTitle: 'Rutta R1｜让每个团队决定都留在上下文里', metaDescription: 'Rutta R1 留住那些容易在对话后消失的小决定。由参与者确认重要内容，让下一步继续留在团队工作中。', language: '语言', nav: ['真实场景', '工作方式', '隐私设计', '硬件', '产品图集 ↗', '联系我们 ↗'], cta: '加入候选名单',
      hero: ['R1', '让每个团队决定都留在上下文里', 'Rutta R1 留住那些容易在对话后消失的小决定。参与者确认重要内容，让下一步继续留在团队工作中。', '加入候选名单', '查看真实场景', '让工作上下文继续流动。<br>让私人时间保持私密。', '从桌边决定到会议室交接，R1 一直跟随你的 Mac。参与者确认哪些内容需要推进，状态灯和实体静音开关让边界清晰可见。', '查看产品图集 ↗'],
      principles: ['留住当下决定', '只让合适的人参与', '让上下文可以直接使用', '很多团队上下文发生在会议之间的两分钟里。R1 帮助合适的人把这一刻变成决定、负责人和下一步。'],
      sections: {scenarios: '真正推动团队前进的时刻，往往发生在会议之间。', scenariosLead: 'R1 为会议之间的时刻而设计：桌边决定、交接承诺、客户复盘，或下一位同事继续推进所需的细节。', workflow: '从桌边对话到团队记忆，无需手动记笔记。', privacy: '一支有清晰边界的工作麦克风。', hardware: '小到融入你的 Mac。<br>清晰到让人信任。', journal: 'R1 的内部设计', faq: '从团队已经拥有的那些时刻开始。'},
      form: {title: '告诉我们，R1 是否适合你的团队。', body: '我们想了解团队在哪些地方会丢失口头决定。如果你想看到下一版 R1 研究，留下邮箱，也可以描述一个团队经常需要重新拼回的时刻。', email: '工作邮箱 *', scenario: 'R1 最能帮助你的团队解决哪个场景？', choices: ['桌边临时决定', '站会承诺与交接', '会后决定补充', 'AI Agent 上下文', '其他'], other: '描述你的场景', otherPlaceholder: '例如：客户工作坊、代理商复盘、创始人同步', team: '团队规模（可选）', teamPlaceholder: '选择团队规模', notes: '你希望 R1 记住什么？（可选）', notesPlaceholder: '告诉我们一个团队今天反复遇到的决定、交接、客户复盘或工作上下文。', consent: '通过邮件接收 R1 进展和可选的 15 分钟概念访谈邀请。', privacy: '隐私说明', submit: '加入候选名单 ↗', note: '写几句话就够了，无需做购买决定。', thanks: '你已加入候选名单。'},
      hardware: {tabs: ['配色', '侧面安装', '静音', '3D 视图'], finish: 'R1 · 银色', fit: '滑动完成连接', switch: '一个实体开关', explore: '旋转查看细节', intro: '拖动旋转，或选择一个细节。', options: ['收音口', 'USB-C', '开关'], reset: '重置'}, footer: ['产品', '工程', '验证', '返回顶部 ↑']
    },
    'ja-JP': {
      metaTitle: 'Rutta R1 | チームの決定を、文脈の中に', metaDescription: 'Rutta R1は会話のあとに消えがちな小さな決定を残します。必要な内容を確認し、次の一歩をチームの仕事につなげます。', language: '言語', nav: ['シーン', '仕組み', 'プライバシー', 'ハードウェア', '製品ギャラリー ↗', 'お問い合わせ ↗'], cta: 'ウェイトリストに参加',
      hero: ['R1', 'チームの決定を、文脈の中に。', 'Rutta R1は会話のあとに消えがちな小さな決定を残します。その場にいた人が大切な内容を確認し、次の一歩をチームの仕事につなげます。', 'ウェイトリストに参加', '実際のシーンを見る', '仕事の文脈をつなぐ。<br>プライベートは守る。', 'デスクでの決定から会議室の引き継ぎまで、R1はMacとともにあります。進める内容を参加者が確認し、ステータスライトと物理ミュートが境界を明確にします。', '製品ギャラリー ↗'],
      principles: ['その瞬間を残す', '参加者を明確にする', '文脈を使える形に', 'チームの文脈は会議の合間の短い会話に生まれます。R1はそれを決定、担当者、次の一歩へつなげます。'],
      sections: {scenarios: 'チームを前に進める瞬間は、会議の合間に生まれます。', scenariosLead: 'R1は会議の合間の決定、引き継ぎ、顧客の振り返り、次の担当者に必要な細部のために設計されています。', workflow: 'デスクの会話からチームの記憶へ。メモは不要です。', privacy: '境界が明確な仕事用マイク。', hardware: 'Macに溶け込むサイズ。<br>信頼できる明快さ。', journal: 'R1の内部', faq: 'チームにすでにある瞬間から始める。'},
      form: {title: 'R1がチームに必要か教えてください。', body: '会話の中の決定がどこで失われるのかを伺っています。次のR1研究を見たい方はメールを、再構成が必要になった瞬間も教えてください。', email: '仕事用メール *', scenario: 'R1が最も役立つ場面は？', choices: ['デスクでの決定', 'スタンドアップと引き継ぎ', '会議後の決定', 'AI Agentの文脈', 'その他'], other: '場面を説明', otherPlaceholder: '例：顧客ワークショップ、代理店レビュー、創業者の同期', team: 'チーム規模（任意）', teamPlaceholder: 'チーム規模を選択', notes: 'R1に覚えてほしいこと（任意）', notesPlaceholder: 'チームが繰り返し直面する決定や引き継ぎを教えてください。', consent: 'R1の進捗と任意の15分コンセプト対話をメールで受け取る。', privacy: 'プライバシー通知', submit: 'ウェイトリストに参加 ↗', note: '短いメモで十分です。購入の判断は必要ありません。', thanks: 'ウェイトリストに登録されました。'},
      hardware: {tabs: ['仕上げ', '装着', 'ミュート', '3Dビュー'], finish: 'R1 · シルバー', fit: 'スライドして接続', switch: '物理スイッチ', explore: '回して見る', intro: 'ドラッグして回転、または詳細を選択。', options: ['収音孔', 'USB-C', 'スイッチ'], reset: 'リセット'}, footer: ['製品', 'エンジニアリング', '検証', 'トップへ戻る ↑']
    },
    'ko-KR': {
      metaTitle: 'Rutta R1 | 팀의 결정을 맥락 속에', metaDescription: 'Rutta R1은 대화 후 사라지는 작은 결정을 남깁니다. 중요한 내용을 확인하고 다음 단계를 팀의 업무에 연결합니다.', language: '언어', nav: ['실제 장면', '작동 방식', '개인정보', '하드웨어', '제품 갤러리 ↗', '문의하기 ↗'], cta: '대기자 명단 참여',
      hero: ['R1', '팀의 결정을 맥락 속에.', 'Rutta R1은 대화 후 사라지는 작은 결정을 남깁니다. 함께 있던 사람들이 중요한 내용을 확인하고 다음 단계를 팀의 업무에 연결합니다.', '대기자 명단 참여', '실제 장면 보기', '업무 맥락을 이어가세요.<br>개인 시간은 지키세요.', '책상 옆 결정부터 회의실 인수인계까지 R1은 Mac과 함께합니다. 참여자가 진행할 내용을 확인하고 상태등과 물리 음소거가 경계를 보여 줍니다.', '제품 갤러리 ↗'],
      principles: ['순간을 남기기', '참여자를 명확히 하기', '맥락을 바로 쓰기', '팀의 맥락은 회의 사이의 짧은 대화에서 생깁니다. R1은 그 순간을 결정, 담당자, 다음 단계로 연결합니다.'],
      sections: {scenarios: '팀을 앞으로 움직이는 순간은 회의 사이에 생깁니다.', scenariosLead: 'R1은 책상 옆 결정, 인수인계, 고객 회고, 다음 담당자에게 필요한 세부 정보를 위해 설계되었습니다.', workflow: '책상 대화에서 팀의 기억으로. 수동 메모는 필요 없습니다.', privacy: '경계가 분명한 업무용 마이크.', hardware: 'Mac에 녹아드는 크기.<br>믿을 수 있는 명확함.', journal: 'R1 내부', faq: '팀이 이미 가진 순간에서 시작하세요.'},
      form: {title: 'R1이 팀에 필요한지 알려 주세요.', body: '말로 한 결정이 어디서 사라지는지 알아보고 있습니다. 다음 R1 연구를 보고 싶다면 이메일을 남기고, 팀이 반복해서 재구성해야 했던 순간을 알려 주세요.', email: '업무 이메일 *', scenario: 'R1이 가장 도움이 될 장면은 무엇인가요?', choices: ['책상 옆 결정', '스탠드업 약속과 인수인계', '회의 후 결정', 'AI Agent 맥락', '기타'], other: '장면 설명', otherPlaceholder: '예: 고객 워크숍, 에이전시 리뷰, 창업자 동기화', team: '팀 규모 (선택)', teamPlaceholder: '팀 규모 선택', notes: 'R1이 기억했으면 하는 내용 (선택)', notesPlaceholder: '팀이 반복해서 마주하는 결정, 인수인계 또는 업무 맥락을 알려 주세요.', consent: 'R1 진행 소식과 선택적 15분 콘셉트 대화를 이메일로 받겠습니다.', privacy: '개인정보 안내', submit: '대기자 명단 참여 ↗', note: '짧은 메모면 충분합니다. 구매 결정은 필요하지 않습니다.', thanks: '대기자 명단에 등록되었습니다.'},
      hardware: {tabs: ['마감', '사이드 장착', '음소거', '3D 보기'], finish: 'R1 · 실버', fit: '밀어서 연결', switch: '물리 스위치 하나', explore: '돌려서 보기', intro: '드래그해 회전하거나 세부 항목을 선택하세요.', options: ['수음구', 'USB-C', '스위치'], reset: '초기화'}, footer: ['제품', '엔지니어링', '검증', '맨 위로 ↑']
    },
    'fr-FR': {
      metaTitle: 'Rutta R1 | Les décisions d’équipe, dans leur contexte', metaDescription: 'Rutta R1 conserve les petites décisions qui disparaissent après une conversation. Confirmez l’essentiel et gardez la prochaine étape avec l’équipe.', language: 'Langue', nav: ['Scènes', 'Fonctionnement', 'Confidentialité', 'Matériel', 'Galerie produit ↗', 'Contact ↗'], cta: 'Rejoindre la liste',
      hero: ['R1', 'Gardez chaque décision d’équipe dans son contexte.', 'Rutta R1 conserve les petites décisions qui disparaissent après une conversation. Les personnes présentes confirment l’essentiel, puis l’étape suivante reste avec le travail de l’équipe.', 'Rejoindre la liste', 'Voir les scènes réelles', 'Le contexte du travail continue.<br>La vie privée reste privée.', 'Du choix au bureau au passage de relais en réunion, R1 accompagne votre Mac. Les participants confirment ce qui doit avancer et le voyant comme le bouton muet rendent la limite visible.', 'Galerie produit ↗'],
      principles: ['Garder le moment', 'Clarifier le cercle', 'Rendre le contexte utile', 'Le contexte d’équipe se crée dans les échanges courts entre deux réunions. R1 transforme ce moment en décision, responsable et prochaine étape.'],
      sections: {scenarios: 'Les moments qui font avancer l’équipe arrivent entre les réunions.', scenariosLead: 'R1 accompagne les décisions au bureau, les relais, les retours clients et les détails dont la prochaine personne a besoin.', workflow: 'De la conversation au bureau à la mémoire d’équipe, sans prise de notes.', privacy: 'Un micro de travail aux limites claires.', hardware: 'Assez petit pour disparaître.<br>Assez clair pour inspirer confiance.', journal: 'À l’intérieur de R1', faq: 'Commencez par les moments que votre équipe connaît déjà.'},
      form: {title: 'Dites-nous si votre équipe a besoin de R1.', body: 'Nous cherchons à comprendre où les décisions dites à voix haute se perdent. Laissez votre email pour voir la prochaine étude R1, ou décrivez le moment que votre équipe doit souvent reconstruire.', email: 'Email professionnel *', scenario: 'Où R1 aiderait-il le plus votre équipe ?', choices: ['Décision au bureau', 'Promesses et relais du stand-up', 'Décision après réunion', 'Contexte pour un agent IA', 'Autre'], other: 'Décrivez votre scénario', otherPlaceholder: 'ex. ateliers clients, revues d’agence, synchronisation des fondateurs', team: 'Taille de l’équipe (facultatif)', teamPlaceholder: 'Choisir la taille', notes: 'Que voudriez-vous que R1 retienne ? (facultatif)', notesPlaceholder: 'Décrivez une décision, un relais ou un contexte que votre équipe reconstruit souvent.', consent: 'Recevoir par email les avancées de R1 et les invitations à un échange de 15 min.', privacy: 'Avis de confidentialité', submit: 'Rejoindre la liste ↗', note: 'Quelques lignes suffisent. Aucun achat n’est demandé.', thanks: 'Vous êtes sur la liste.'},
      hardware: {tabs: ['Finitions', 'Fixation', 'Muet', 'Vue 3D'], finish: 'R1 · Argent', fit: 'Faire glisser pour connecter', switch: 'Un bouton physique', explore: 'Tourner pour voir', intro: 'Faites pivoter ou choisissez un détail.', options: ['Ouvertures', 'USB-C', 'Bouton'], reset: 'Réinitialiser'}, footer: ['Produit', 'Ingénierie', 'Validation', 'Retour en haut ↑']
    },
    'de-DE': {
      metaTitle: 'Rutta R1 | Teamentscheidungen im Kontext', metaDescription: 'Rutta R1 bewahrt kleine Entscheidungen, die nach einem Gespräch oft verschwinden. Bestätigt das Wichtige und haltet den nächsten Schritt im Team fest.', language: 'Sprache', nav: ['Szenarien', 'So funktioniert es', 'Datenschutz', 'Hardware', 'Produktgalerie ↗', 'Kontakt ↗'], cta: 'Warteliste beitreten',
      hero: ['R1', 'Teamentscheidungen im Kontext.', 'Rutta R1 bewahrt kleine Entscheidungen, die nach einem Gespräch oft verschwinden. Die Anwesenden bestätigen das Wichtige, dann bleibt der nächste Schritt bei der Arbeit des Teams.', 'Warteliste beitreten', 'Echte Szenarien ansehen', 'Arbeitskontext bleibt erhalten.<br>Privates bleibt privat.', 'Von der Entscheidung am Schreibtisch bis zur Übergabe im Meeting begleitet R1 deinen Mac. Die Beteiligten bestätigen, was weitergeht, während Statuslicht und Stummschalter die Grenze sichtbar machen.', 'Produktgalerie ↗'],
      principles: ['Den Moment festhalten', 'Den Kreis klar halten', 'Kontext nutzbar machen', 'Teamkontext entsteht in kurzen Gesprächen zwischen Meetings. R1 macht daraus Entscheidung, Verantwortliche und nächsten Schritt.'],
      sections: {scenarios: 'Die Momente, die ein Team voranbringen, passieren zwischen Meetings.', scenariosLead: 'R1 ist für Entscheidungen am Schreibtisch, Übergaben, Kundenrückblicke und Details gedacht, die die nächste Person braucht.', workflow: 'Vom Gespräch am Schreibtisch zum Teamgedächtnis, ohne manuelle Notizen.', privacy: 'Ein Arbeitsmikrofon mit klarer Grenze.', hardware: 'Klein genug, um zu verschwinden.<br>Klar genug, um zu vertrauen.', journal: 'R1 im Detail', faq: 'Beginnt mit den Momenten, die euer Team schon kennt.'},
      form: {title: 'Erzählt uns, ob euer Team R1 braucht.', body: 'Wir möchten verstehen, wo gesprochene Entscheidungen verloren gehen. Hinterlasst eure E-Mail für die nächste R1-Studie oder beschreibt den Moment, den euer Team immer wieder rekonstruieren muss.', email: 'Arbeits-E-Mail *', scenario: 'Wo würde R1 eurem Team am meisten helfen?', choices: ['Entscheidung am Schreibtisch', 'Stand-up-Zusagen und Übergaben', 'Entscheidung nach dem Meeting', 'Kontext für AI Agents', 'Andere'], other: 'Szenario beschreiben', otherPlaceholder: 'z. B. Kundenworkshops, Agentur-Reviews, Gründer-Abgleich', team: 'Teamgröße (optional)', teamPlaceholder: 'Teamgröße wählen', notes: 'Was soll R1 behalten? (optional)', notesPlaceholder: 'Beschreibt eine Entscheidung, Übergabe oder Kontext, den euer Team oft rekonstruiert.', consent: 'R1-Fortschritte und optionale 15-minütige Konzeptgespräche per E-Mail erhalten.', privacy: 'Datenschutzhinweis', submit: 'Warteliste beitreten ↗', note: 'Ein kurzer Hinweis genügt. Eine Kaufentscheidung ist nicht nötig.', thanks: 'Ihr steht auf der Warteliste.'},
      hardware: {tabs: ['Oberflächen', 'Seitensitz', 'Stumm', '3D-Ansicht'], finish: 'R1 · Silber', fit: 'Zum Verbinden schieben', switch: 'Ein physischer Schalter', explore: 'Drehen und ansehen', intro: 'Zum Drehen ziehen oder ein Detail wählen.', options: ['Öffnungen', 'USB-C', 'Schalter'], reset: 'Ansicht zurücksetzen'}, footer: ['Produkt', 'Engineering', 'Validierung', 'Nach oben ↑']
    }
  };
  const select = document.querySelector('[data-language-toggle]');
  if (!select) return;
  const supported = value => locales.includes(value) ? value : null;
  const detect = () => {
    const query = supported(new URLSearchParams(location.search).get('lang')); if (query) return query;
    try { const saved = supported(localStorage.getItem('rutta-r1-locale')); if (saved) return saved; } catch {}
    for (const candidate of navigator.languages || [navigator.language]) {
      const exact = supported(candidate); if (exact) return exact;
      const prefix = locales.find(locale => locale.slice(0,2) === String(candidate).slice(0,2)); if (prefix) return prefix;
    }
    return fallback;
  };
  let current = detect();
  const value = () => copy[current] || copy[fallback];
  const nodes = selector => [...document.querySelectorAll(selector)];
  const setText = (selector, text, index = 0) => { const node = nodes(selector)[index]; if (node) node.textContent = text; };
  const setHtml = (selector, html, index = 0) => { const node = nodes(selector)[index]; if (node) node.innerHTML = html; };
  const setAttr = (selector, attr, text, index = 0) => { const node = nodes(selector)[index]; if (node) node.setAttribute(attr, text); };
  function applyStatic() {
    const c = value();
    document.documentElement.lang = current;
    document.title = c.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', c.metaDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', c.metaTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', c.metaDescription);
    select.value = current;
    select.setAttribute('aria-label', c.language);
    nodes('.lk-links a').forEach((node, i) => { if (c.nav[i]) node.textContent = c.nav[i]; });
    nodes('.lk-cta').forEach(node => { node.textContent = c.cta; });
    setText('.lk-slide .lk-eyebrow', c.hero[0], 0);
    setText('.lk-slide h1', c.hero[1]); setText('.lk-slide h2', '', 0); setHtml('.lk-slide h2', c.hero[5]);
    setText('.lk-slide > .lk-hero-panel > p:not(.lk-eyebrow)', c.hero[2], 0); setText('.lk-slide > .lk-hero-panel > p:not(.lk-eyebrow)', c.hero[6], 1);
    nodes('.lk-hero-pill').forEach(node => node.textContent = c.hero[3]);
    setText('.lk-hero-text', c.hero[4], 0); setText('.lk-hero-text', c.hero[7], 1);
    nodes('.detail-strip [data-detail]').forEach((node, i) => node.textContent = c.principles[i]);
    setText('#detail-explainer', c.principles[3]);
    setText('#scenarios-title', c.sections.scenarios); setText('#scenarios .lk-heading > p:last-child', c.sections.scenariosLead);
    setText('#workflow-title', c.sections.workflow); setHtml('#privacy-title', c.sections.privacy); setHtml('#lk-hardware-title', c.sections.hardware); setText('#field-title', c.sections.journal); setText('#faq-title', c.sections.faq);
    nodes('.lk-research-choices button').forEach((node, i) => node.textContent = c.form.choices[i]);
    setText('#waitlist-title', c.form.title); setText('#waitlist .lk-research-copy > p:not(.lk-research-kicker):not(.lk-research-contact)', c.form.body); setText('[data-field="email"] > span', c.form.email); setText('.lk-scenario-group legend', c.form.scenario); setText('.lk-other-wrap > span', c.form.other); setAttr('.lk-other-wrap input','placeholder',c.form.otherPlaceholder); setText('[data-field="team-size"] > span', c.form.team); setText('.lk-research-field select[name="teamSize"] option[value=""]', c.form.teamPlaceholder); setText('[data-field="notes"] > span', c.form.notes); setAttr('textarea[name="notesText"]','placeholder',c.form.notesPlaceholder); setText('.lk-consent-copy', c.form.consent); setText('.lk-inline-link', c.form.privacy); setText('.lk-research-submit', c.form.submit); setText('.lk-research-note', c.form.note); setText('.lk-thanks-badge', '✓ ' + c.form.thanks);
    nodes('.lk-hw-tabs a').forEach((node, i) => node.textContent = c.hardware.tabs[i]); setText('#lk-finish-name', c.hardware.finish); setText('#fit .lk-hw-caption h3', c.hardware.fit); setText('#switch .lk-hw-caption h3', c.hardware.switch); setText('#explore .lk-hw-caption h3', c.hardware.explore); setText('.rb-explore-intro', c.hardware.intro); nodes('#explore .lk-hw-options button[data-rb-part]').forEach((node, i) => node.textContent = c.hardware.options[i]); setText('.rb-explore-reset', c.hardware.reset);
    nodes('.lk-foot-links strong').forEach((node, i) => node.textContent = c.footer[i]); setText('.lk-foot-top', c.footer[3]); setText('#privacy-dialog-title', c.form.privacy);
    applyDynamic();
  }
  function applyDynamic() {
    const c = value();
    const pstate = document.querySelector('#privacy .lk-privacy-states button[aria-pressed="true"]')?.dataset.pstate || 'mute';
    const privacy = {ready: ['Ready','待机','準備完了','준비됨','Prêt','Bereit'], input: ['Active','收音中','収音中','사용 중','Actif','Aktiv'], mute: ['Muted','已静音','ミュート','음소거','Muet','Stumm']}[pstate];
    const pi = locales.indexOf(current); setText('#privacy-caption', current === 'en-US' ? ({ready:'Green breathing light on top · Switch open, R1 ready.',input:'Solid amber light on top · Enrolled speech active.',mute:'Light off · Orange mechanical marker visible in the switch track.'}[pstate]) : privacy[pi]);
    const state = document.querySelector('#switch')?.dataset.state || 'ready';
    const messages = {ready:['The light on top breathes green while R1 is ready.','顶部绿灯呼吸，表示 R1 已就绪。','上部の緑のライトが呼吸し、R1の準備完了を知らせます。','상단 녹색 표시등이 숨 쉬듯 켜지며 R1이 준비되었음을 알립니다.','Le voyant vert respire quand R1 est prêt.','Das grüne Licht pulsiert, wenn R1 bereit ist.'],input:['The light stays amber while audio is being sent to your Mac.','声音传入 Mac 时，灯光保持黄色。','Macへ音声を送る間、ライトはアンバーに点灯します。','Mac으로 오디오를 보내는 동안 표시등이 황색으로 유지됩니다.','Le voyant reste ambre pendant l’envoi audio vers le Mac.','Während Audio an den Mac gesendet wird, leuchtet es gelb.'],mute:['The top light goes out. An orange marker in the switch track shows the microphone is muted.','顶部灯熄灭，开关轨道中的橙色标记显示麦克风已静音。','上部のライトが消え、スイッチのオレンジの印がミュートを示します。','상단 표시등이 꺼지고 스위치 트랙의 주황색 표시가 음소거를 보여 줍니다.','Le voyant supérieur s’éteint. Un repère orange indique que le micro est muet.','Das obere Licht erlischt. Eine orange Markierung zeigt, dass das Mikro stumm ist.']}[state]; setText('.rb-switch-reading', messages?.[pi] || messages?.[0]);
    const finish = document.querySelector('#finish [data-tone][aria-pressed="true"]')?.getAttribute('aria-label') || 'Silver'; if (current !== 'en-US') setText('#lk-finish-name', c.hardware.finish);
  }
  function setLocale(locale) { const next = supported(locale); if (!next) return; current = next; try { localStorage.setItem('rutta-r1-locale', current); } catch {} const url = new URL(location.href); url.searchParams.set('lang', current); history.replaceState({}, '', url); applyStatic(); window.dispatchEvent(new CustomEvent('rutta:localechange', {detail:{locale:current}})); }
  select.addEventListener('change', event => setLocale(event.target.value));
  document.addEventListener('click', () => requestAnimationFrame(applyDynamic));
  window.addEventListener('rutta:localechange', applyDynamic);
  window.ruttaI18n = {locales, get locale(){return current;}, setLocale, copy};
  applyStatic();
})();
