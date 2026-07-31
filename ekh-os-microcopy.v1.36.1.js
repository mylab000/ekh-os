
(() => {
  'use strict';

  const WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[’'/-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g;
  const PHRASE_MAP = [["^decision rooms is now", "Decision Rooms manage owner choices."], ["^my activities is now", "My Activities tracks owner records."], ["^staff drive is now", "Staff Drive manages authorised files."], ["^system is now", "System tracks readiness evidence."], ["^task calendar is now", "Task Calendar tracks weekly work."], ["^the organisation is presented", "Organisation shows roles and authority."], ["^this local record reviews", "Local review changes nothing."], ["^this local record", "Local record changes nothing."], ["^this is a local", "Local record changes nothing."], ["^it does not change", "No system changes occur."], ["^it does not modify", "No system changes occur."], ["^click one row", "Select one staff record."], ["^the selected person", "Page four shows details."], ["^record the owner", "Record the owner assessment."], ["^select an assessment", "Choose, confirm, then sign."], ["^type the owner name", "Type the owner name."], ["^workstreams define what moves", "Workstreams guide department delivery."], ["^controls define what must be true", "Controls define acceptance requirements."], ["^work moves to the relevant", "Use required cross-team reviews."], ["^ownership does not remove", "Cross-team review remains required."], ["^what this department owns", "Department ownership and handoffs."], ["^select a staff record", "Select one staff record."], ["^the department file separates", "Dossier separates key controls."], ["^each workstream states", "Each workstream names evidence."], ["^all three colouring-book volumes", "All three volumes are complete."], ["^the current operational phase", "Promotion targets fifty early buyers."], ["^a learning item must", "Learning items require full suitability."], ["^reo continues the question-bank audit", "Reo audits questions."], ["^jeff continues application development", "Jeff develops applications."], ["^the formal audit handoff", "Jeff awaits formal audit handoff."], ["^no new status change", "No status changes recorded."], ["^all projects and team members", "Projects retain verified status."], ["^use this brief to distinguish", "Separate configuration from proof."], ["^project status must not", "Status changes require proof."], ["^tick an item only", "Tick only verified actions."], ["^access is restricted", "Only authorised access applies."], ["^open the existing supabase", "Open the Supabase activity form."], ["^swipe horizontally", "Swipe or use arrows."], ["^read one owner-entered advisory", "Read one perspective each time."], ["^all ten organisation department", "Ten department dossiers are ready."], ["^every staff row is clickable", "Every staff row opens."], ["^the review does not change", "Review changes no systems."]].map(item => [
    new RegExp(item[0],'i'),
    item[1]
  ]);
  const STOPWORDS = new Set(["about", "across", "actual", "adalah", "after", "against", "akan", "among", "and", "antara", "apabila", "around", "as", "at", "atau", "available", "bagi", "before", "berkaitan", "between", "but", "by", "current", "dalam", "dan", "dari", "dengan", "during", "earlier", "existing", "final", "for", "formal", "from", "full", "how", "ialah", "if", "immediate", "in", "ini", "into", "itu", "juga", "kepada", "kerana", "ketika", "latest", "lebih", "local", "mana", "masih", "mengenai", "new", "of", "oleh", "on", "onto", "or", "other", "over", "own", "pada", "paling", "per", "relevant", "sahaja", "same", "sangat", "sebagai", "sebelum", "secara", "sedang", "selected", "selepas", "semasa", "semua", "serta", "setiap", "supaya", "tanpa", "telah", "terhadap", "than", "then", "through", "to", "under", "until", "untuk", "upon", "via", "what", "when", "where", "which", "while", "who", "whom", "whose", "why", "with", "yang"]);
  const ARTICLES = new Set(["a", "an", "para", "sebuah", "seorang", "suatu", "that", "the", "these", "this", "those"]);
  const NUMBER_WORDS = new Set(["dua", "eight", "eighth", "empat", "enam", "fifth", "first", "five", "four", "fourth", "kedua", "keempat", "kelima", "ketiga", "lapan", "lima", "nine", "ninth", "one", "pertama", "satu", "second", "sembilan", "sepuluh", "seven", "seventh", "six", "sixth", "ten", "tenth", "third", "three", "tiga", "tujuh", "two"]);
  const MODALS = new Set(["akan", "boleh", "can", "could", "may", "mesti", "might", "must", "patut", "perlu", "shall", "should", "will", "would"]);
  const VERBS = new Set(["add", "adds", "align", "aligns", "allow", "allows", "am", "appear", "appears", "approve", "approves", "archive", "archives", "are", "assign", "assigns", "audit", "audits", "be", "become", "becomes", "been", "being", "block", "blocks", "build", "builds", "certifies", "certify", "change", "changes", "choose", "chooses", "clarifies", "clarify", "close", "closes", "complete", "completes", "confirm", "confirms", "connect", "connects", "contain", "contains", "continue", "continues", "control", "controls", "coordinate", "coordinates", "create", "creates", "decide", "decides", "define", "defines", "deliver", "delivers", "depend", "depends", "develop", "develops", "did", "display", "displays", "do", "does", "download", "downloads", "enforce", "enforces", "ensure", "ensures", "execute", "executes", "follow", "follows", "guide", "guides", "had", "has", "have", "hold", "holds", "improve", "improves", "include", "includes", "inspect", "inspects", "is", "keep", "keeps", "list", "lists", "maintain", "maintains", "manage", "manages", "map", "maps", "modifies", "modify", "move", "moves", "need", "needs", "open", "opens", "own", "owns", "prepare", "prepares", "preserve", "preserves", "protect", "protects", "provide", "provides", "publish", "publishes", "read", "reads", "record", "records", "reduce", "reduces", "remain", "remains", "require", "requires", "resolve", "resolves", "restore", "restores", "restrict", "restricts", "retain", "retains", "return", "returns", "review", "reviews", "select", "selects", "separate", "separates", "serve", "serves", "show", "shows", "sign", "signs", "state", "states", "support", "supports", "track", "tracks", "treat", "treats", "update", "updates", "upload", "uploads", "use", "uses", "validate", "validates", "verifies", "verify", "wait", "waits", "was", "were", "write", "writes"]);
  const SKIP = new Set([
    'SCRIPT','STYLE','NOSCRIPT','TEMPLATE','CODE','PRE',
    'TEXTAREA','INPUT','SVG','PATH'
  ]);
  const TITLE_TAGS = new Set([
    'P','SMALL','SPAN','STRONG','LI','DD','DT','BLOCKQUOTE',
    'LABEL','BUTTON','EM','B','H1','H2','H3','H4','H5','H6'
  ]);
  const processedText = new WeakMap();
  const processedPlaceholder = new WeakMap();

  function words(text){
    return String(text || '').match(WORD_RE) || [];
  }

  function isVerb(token){
    const lower = token.toLowerCase();
    return VERBS.has(lower)
      || (lower.length > 4 && (
        lower.endsWith('ed') || lower.endsWith('ing')
      ));
  }

  function conciseClause(text){
    const source = String(text || '')
      .replace(/\s+/g,' ')
      .trim()
      .replace(/^[\s,;:-]+|[\s,;:-]+$/g,'');

    if(!source) return '';

    for(const [pattern,replacement] of PHRASE_MAP){
      if(pattern.test(source)) return replacement;
    }

    const tokens = words(source);
    if(tokens.length <= 5){
      return /[.!?]$/.test(source) ? source : `${source}.`;
    }

    const verbIndex = tokens.findIndex(isVerb);
    let chosen = [];

    if(verbIndex < 0){
      const content = tokens.filter(token => {
        const lower = token.toLowerCase();
        return !STOPWORDS.has(lower) && !ARTICLES.has(lower);
      });
      chosen = (content.length ? content : tokens).slice(0,5);
    }else{
      let prefix = tokens.slice(0,verbIndex);
      let verbPhrase = [tokens[verbIndex]];
      let post = tokens.slice(verbIndex + 1);

      if(verbIndex > 0 && MODALS.has(tokens[verbIndex - 1].toLowerCase())){
        prefix = tokens.slice(0,verbIndex - 1);
        verbPhrase = [tokens[verbIndex - 1],tokens[verbIndex]];
      }

      if(
        ['do','does','did'].includes(tokens[verbIndex].toLowerCase())
        && verbIndex + 2 < tokens.length
        && tokens[verbIndex + 1].toLowerCase() === 'not'
      ){
        verbPhrase = [
          tokens[verbIndex],
          tokens[verbIndex + 1],
          tokens[verbIndex + 2]
        ];
        post = tokens.slice(verbIndex + 3);
      }

      let prefixContent = prefix.filter(token => {
        const lower = token.toLowerCase();
        return !ARTICLES.has(lower) && !STOPWORDS.has(lower);
      });
      if(!prefixContent.length && prefix.length){
        prefixContent = [prefix[prefix.length - 1]];
      }

      let subject;
      if(prefixContent.some(token =>
        NUMBER_WORDS.has(token.toLowerCase()) || /^\d+$/.test(token)
      )){
        subject = prefixContent.slice(-3);
      }else if(
        prefixContent.length
        && (
          /^[A-Z]/.test(prefixContent[0])
          || prefixContent[0] === prefixContent[0].toUpperCase()
        )
      ){
        subject = prefixContent.slice(0,2);
      }else{
        subject = prefixContent.slice(-2);
      }

      const postContent = post.filter(token => {
        const lower = token.toLowerCase();
        return !ARTICLES.has(lower) && !STOPWORDS.has(lower);
      });

      const remaining = 5 - subject.length - verbPhrase.length;
      chosen = [
        ...subject,
        ...verbPhrase,
        ...postContent.slice(0,Math.max(0,remaining))
      ];

      if(chosen.length < 3){
        for(const token of tokens){
          if(!chosen.includes(token)) chosen.push(token);
          if(chosen.length >= 5) break;
        }
      }
      chosen = chosen.slice(0,5);
    }

    let output = chosen.join(' ');
    if(output && /^[A-ZÀ-ÖØ-Þ]/.test(source)){
      output = output.charAt(0).toUpperCase() + output.slice(1);
    }

    const punctuation = source.endsWith('?')
      ? '?'
      : source.endsWith('!')
        ? '!'
        : '.';

    return `${output}${punctuation}`;
  }

  function conciseText(text){
    const normalized = String(text || '').replace(/\s+/g,' ').trim();
    if(!normalized) return '';

    const sentenceParts = normalized.match(/[^.!?;]+[.!?;]?/g) || [normalized];
    const output = [];

    sentenceParts.forEach(sentence => {
      const clean = sentence.trim();
      if(!clean) return;

      const clauses = words(clean).length > 10
        ? clean.split(/\s+(?:while|but|whereas|yet|dan|tetapi)\s+/i)
        : [clean];

      clauses.forEach(clause => {
        const shortened = conciseClause(clause);
        if(shortened) output.push(shortened);
      });
    });

    return output.join(' ');
  }

  function sentenceCounts(text){
    const parts = String(text || '').match(/[^.!?;]+[.!?;]?/g) || [];
    return parts
      .map(part => words(part.trim()).length)
      .filter(Boolean);
  }

  function shouldSkip(node){
    const parent = node.parentElement;
    if(!parent || SKIP.has(parent.tagName)) return true;
    if(parent.closest(
      'script,style,noscript,template,code,pre,textarea,input,svg,' +
      '[contenteditable="true"],[data-ekh-microcopy-preserve]'
    )) return true;
    return false;
  }

  function preserveFullCopy(parent,original){
    if(!parent || !TITLE_TAGS.has(parent.tagName)) return;
    if(!parent.dataset.ekhFullCopy){
      parent.dataset.ekhFullCopy = original;
    }
    if(!parent.hasAttribute('title')){
      parent.setAttribute('title',original);
    }
  }

  function processTextNode(node){
    if(!node || node.nodeType !== Node.TEXT_NODE || shouldSkip(node)) return;

    const current = String(node.nodeValue || '');
    if(processedText.get(node) === current) return;

    const normalized = current.replace(/\s+/g,' ').trim();
    if(!normalized || !words(normalized).length){
      processedText.set(node,current);
      return;
    }

    if(!sentenceCounts(normalized).some(count => count > 5)){
      processedText.set(node,current);
      return;
    }

    const shortened = conciseText(normalized);
    if(!shortened){
      processedText.set(node,current);
      return;
    }

    preserveFullCopy(node.parentElement,normalized);

    const leading = current.match(/^\s*/)?.[0] || '';
    const trailing = current.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${shortened}${trailing}`;
    processedText.set(node,node.nodeValue);
  }

  function processPlaceholder(element){
    if(!element || !element.hasAttribute('placeholder')) return;

    const current = element.getAttribute('placeholder') || '';
    if(processedPlaceholder.get(element) === current) return;

    if(!sentenceCounts(current).some(count => count > 5)){
      processedPlaceholder.set(element,current);
      return;
    }

    const shortened = conciseText(current);
    if(!shortened){
      processedPlaceholder.set(element,current);
      return;
    }

    element.dataset.ekhPlaceholderFull = current;
    if(!element.hasAttribute('title')) element.setAttribute('title',current);
    element.setAttribute('placeholder',shortened);
    processedPlaceholder.set(element,shortened);
  }

  function processRoot(root){
    if(!root) return;

    if(root.nodeType === Node.TEXT_NODE){
      processTextNode(root);
      return;
    }

    if(root.nodeType !== Node.ELEMENT_NODE
      && root.nodeType !== Node.DOCUMENT_NODE
      && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE){
      return;
    }

    if(root.nodeType === Node.ELEMENT_NODE){
      processPlaceholder(root);
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node){
          return shouldSkip(node)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(processTextNode);

    if(root.querySelectorAll){
      root.querySelectorAll('[placeholder]').forEach(processPlaceholder);
    }
  }

  function audit(){
    const violations = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node){
          return shouldSkip(node)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    while(walker.nextNode()){
      const node = walker.currentNode;
      const text = String(node.nodeValue || '').replace(/\s+/g,' ').trim();
      if(!text) continue;

      sentenceCounts(text).forEach(count => {
        if(count > 5){
          violations.push({
            words:count,
            text,
            tag:node.parentElement?.tagName || ''
          });
        }
      });
    }

    return {
      release:'v1.36.1',
      build_id:'EKH-OS-NAVD-20260731-001',
      maximum_words_per_sentence:5,
      violations
    };
  }

  function init(){
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if(mutation.type === 'characterData'){
          processTextNode(mutation.target);
          return;
        }
        mutation.addedNodes.forEach(processRoot);
      });
    });

    observer.observe(document.body,{
      subtree:true,
      childList:true,
      characterData:true
    });

    window.EKHFiveWordMicrocopy = {
      refresh:() => processRoot(document.body),
      audit,
      conciseText,
      mode:'idle-first-scan'
    };

    const scan = () => processRoot(document.body);
    if('requestIdleCallback' in window){
      requestIdleCallback(scan,{timeout:1200});
    }else{
      setTimeout(scan,0);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
