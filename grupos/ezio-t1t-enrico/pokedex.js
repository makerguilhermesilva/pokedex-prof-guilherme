(function () {
  'use strict';
  const CATEGORIAS = [
  {
    "name": "Mamíferos",
    "emoji": "🐆",
    "description": "Onças, macacos e muito mais",
    "image": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=85"
  },
  {
    "name": "Aves",
    "emoji": "🦜",
    "description": "Asas e cantos da floresta",
    "image": "https://www.petz.com.br/blog/wp-content/uploads/2024/04/aves-brasileiras-topo.jpg"
  },
  {
    "name": "Répteis",
    "emoji": "🐍",
    "description": "Escamas e camuflagem",
    "image": "https://s1.static.brasilescola.uol.com.br/be/2020/11/camaleao.jpg"
  },
  {
    "name": "Anfíbios",
    "emoji": "🐸",
    "description": "Pequenos saltos e coaxos",
    "image": "https://s2-umsoplaneta.glbimg.com/UaKmM5BZcNz56w907t0BVPJJ1Xg=/0x0:2121x1414/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_7d5b9b5029304d27b7ef8a7f28b4d70f/internal_photos/bs/2022/G/t/pGZRXxQrKGLSsRgJhQEg/gettyimages-898596842.jpg"
  },
  {
    "name": "Peixes",
    "emoji": "🐟",
    "description": "Vida nos rios brasileiros",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG8v0vAQ1s4UhRtKNePLxPfCeRWVGSVtL-vZyXPUOvNLSglDyLcn6FMVUF&s=10"
  },
  {
    "name": "Insetos",
    "emoji": "🦋",
    "description": "Mestres pequeninos",
    "image": "https://s2-vidadebicho.glbimg.com/ci30eqd7a9KhF3Y_rC9GSQvnz20=/0x0:800x532/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_fb623579cd474803aedbbbbae014af68/internal_photos/bs/2022/A/A/9G6JdoTvWBhfYh59Mb2g/2022-11-04-c233b320-8e2d-4949-9260-22f7cc91ca17.jpeg"
  },
  {
    "name": "Plantas",
    "emoji": "🌿",
    "description": "Folhas, árvores e cipós",
    "image": "https://casaefesta.com/wp-content/uploads/2024/04/plantas-nativas-do-brasil-para-ter-no-apartamento-5.webp"
  },
  {
    "name": "Flores",
    "emoji": "🌺",
    "description": "Cores e formas naturais",
    "image": "https://casaeconstrucao.org/wp-content/uploads/2023/06/1-flor-brasileira-amarela-Wikipedia.jpg"
  },
  {
    "name": "Frutas",
    "emoji": "🍈",
    "description": "Sabores que vêm da mata",
    "image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=85"
  },
  {
    "name": "Fungos",
    "emoji": "🍄",
    "description": "Vida escondida no chão",
    "image": "https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=800&q=85"
  }
];
  const CHAVE = 'pokedex-mata-ezio-t1t-enrico';
  const $ = id => document.getElementById(id);
  const normalizar = valor => String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const slug = valor => normalizar(valor).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const texto = (valor, padrao = '') => Array.isArray(valor) ? valor.join(' • ') : (typeof valor === 'string' && valor ? valor : padrao);
  const fotoValida = valor => typeof valor === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(valor);
  CATEGORIAS.forEach(c => { c.id = slug(c.name); });
  function lerAlbum() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE) || '[]');
      return Array.isArray(dados) ? dados.filter(d => d && typeof d.nome === 'string' && typeof d.categoria === 'string' && d.info && typeof d.info === 'object') : [];
    } catch (erro) { return []; }
  }
  function configurarFicha() {
    if (window.FichaPokedex) FichaPokedex.configurar({ icone: '🌿', cor: '#9cf36b', cor2: '#6de8dc', fauna: true, escuro: () => true, noturno: { fundo: '#06251f', texto: '#fff6d9', suave: '#c3e6d3' } });
  }
  function criarTexto(pai, tag, valor, classe) {
    const el = document.createElement(tag);
    el.textContent = valor;
    if (classe) el.className = classe;
    pai.appendChild(el);
    return el;
  }
  function desenharAlbum() {
    const grid = $('safariGrid');
    if (!grid) return;
    const itens = lerAlbum();
    $('count').textContent = itens.length;
    $('albumCount').textContent = itens.length + (itens.length === 1 ? ' espécie' : ' espécies');
    grid.replaceChildren();
    if (!itens.length) {
      criarTexto(grid, 'p', 'Seu Safari ainda está vazio. Escolha uma categoria, identifique uma foto e salve sua descoberta.', 'album-empty');
      return;
    }
    itens.forEach(item => {
      const card = document.createElement('article');
      card.className = 'safari-item';
      if (fotoValida(item.foto)) {
        const foto = document.createElement('img');
        foto.src = item.foto; foto.alt = item.nome; foto.loading = 'lazy'; foto.className = 'safari-foto';
        card.appendChild(foto);
      }
      criarTexto(card, 'h3', item.nome);
      criarTexto(card, 'p', item.categoria);
      const biomas = texto(item.info.biomas);
      if (biomas) criarTexto(card, 'p', biomas);
      const abrir = criarTexto(card, 'button', 'Ver ficha', 'secondary');
      abrir.type = 'button';
      abrir.addEventListener('click', () => {
        if (window.FichaPokedex) {
          configurarFicha();
          FichaPokedex.mostrar(item.info, { foto: fotoValida(item.foto) ? item.foto : '', acoes: [{ texto: 'Fechar', principal: true }] });
        }
      });
      grid.appendChild(card);
    });
  }
  function iniciarInicio() {
    const grid = $('categoryGrid');
    let navegando = false;
    CATEGORIAS.forEach(c => {
      const link = document.createElement('a');
      link.className = 'category'; link.href = 'descoberta.html?categoria=' + encodeURIComponent(c.id);
      link.style.setProperty('--category-image', 'url("' + c.image + '")');
      link.setAttribute('aria-label', c.name);
      const conteudo = document.createElement('span'); conteudo.className = 'category-content';
      criarTexto(conteudo, 'span', c.emoji, 'category-emoji');
      criarTexto(conteudo, 'span', c.name, 'category-name');
      criarTexto(conteudo, 'span', c.description, 'category-desc');
      link.appendChild(conteudo);
      link.addEventListener('click', evento => {
        if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey || evento.button !== 0) return;
        evento.preventDefault();
        if (navegando) return;
        navegando = true; link.classList.add('selected');
        $('toast').textContent = 'Trilha escolhida: ' + c.name + ' 🌿'; $('toast').classList.add('show');
        setTimeout(() => location.assign(link.href), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
      });
      grid.appendChild(link);
    });
    window.addEventListener('pageshow', () => {
      navegando = false;
      grid.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
      $('toast').classList.remove('show');
      desenharAlbum();
    });
    window.addEventListener('storage', evento => { if (evento.key === CHAVE || evento.key === null) desenharAlbum(); });
    desenharAlbum();
  }
  function iniciarDescoberta() {
    const parametro = new URLSearchParams(location.search).get('categoria');
    const categoria = CATEGORIAS.find(c => c.id === slug(parametro));
    const input = $('photoInput'), preview = $('preview'), analisar = $('analyzeBtn'), salvar = $('saveBtn');
    let versao = 0, identificando = false, fotoPreparada = '', miniatura = '', atual = null;
    function avisar(mensagem) { $('fileStatus').textContent = mensagem; }
    function bloquear(ativo) {
      identificando = ativo;
      input.disabled = ativo || !categoria;
      analisar.disabled = ativo || !fotoPreparada || !categoria;
      analisar.textContent = ativo ? '🔎 Identificando...' : 'Analisar imagem';
      salvar.disabled = ativo || !atual || atual.salvo;
      document.querySelectorAll('.fp-galeria').forEach(b => { b.disabled = ativo || !categoria; });
    }
    function limparFicha() {
      atual = null;
      salvar.disabled = true; salvar.textContent = '💾 Salvar no Safari';
      $('speciesName').textContent = 'Sua descoberta aparecerá aqui';
      $('speciesText').textContent = 'Tire uma foto e toque em Analisar imagem.';
      $('curiosityText').textContent = 'As curiosidades aparecem após a identificação.';
      $('conservationTitle').textContent = 'Conservação';
      $('conservationText').textContent = 'Aguardando identificação.';
      $('biomeText').textContent = 'Os biomas confirmados serão destacados após a identificação.';
      $('confidence').textContent = '';
      $('safetyNotice').hidden = true;
      document.querySelectorAll('#biomeGrid .biome').forEach(el => el.classList.remove('confirmed'));
    }
    function limparFoto(limparCampo = true) {
      ++versao; fotoPreparada = ''; miniatura = '';
      if (limparCampo) input.value = '';
      preview.removeAttribute('src'); preview.style.display = 'none';
      limparFicha(); bloquear(false);
    }
    function salvarAtual() {
      if (identificando || !atual || atual.salvo) return;
      try {
        const lista = lerAlbum();
        const nome = texto(atual.info.nome_popular || atual.info.nome, 'Descoberta');
        const item = { nome, categoria: categoria.name, foto: atual.foto, info: atual.info, data: new Date().toISOString() };
        const i = lista.findIndex(d => normalizar(d.nome) === normalizar(nome) && d.categoria === categoria.name);
        if (i >= 0) lista.splice(i, 1);
        lista.unshift(item);
        localStorage.setItem(CHAVE, JSON.stringify(lista));
        atual.salvo = true; salvar.textContent = '✓ Salvo no Safari'; bloquear(false);
        avisar('Descoberta salva! Toque em Meu Safari para ver seu álbum.');
      } catch (erro) {
        avisar('Não consegui salvar a foto. O armazenamento do navegador está cheio ou indisponível.');
      }
    }
    salvar.addEventListener('click', salvarAtual);
    if (categoria) {
      $('categoryTag').textContent = categoria.emoji + ' Categoria: ' + categoria.name + ' · ' + categoria.description;
    } else {
      $('categoryTag').textContent = 'Escolha uma categoria para começar';
      avisar('Volte às categorias e escolha o que deseja identificar.');
    }
    // No caminho do evento, window recebe a seleção antes da conferência do adaptador.
    // Assim, até um arquivo rejeitado invalida a foto e a ficha anteriores.
    window.addEventListener('change', evento => {
      if (evento.target !== input || identificando || !categoria) return;
      const arquivo = input.files && input.files[0];
      if (!arquivo) return;
      limparFoto(false);
      const leitura = versao;
      if (!arquivo.type.startsWith('image/')) { avisar('Escolha um arquivo de imagem.'); return; }
      if (arquivo.size > 10000000) { avisar('Essa foto é grande demais. Escolha uma imagem de até 10 MB.'); return; }
      avisar('Preparando sua foto...');
      const falhou = () => { if (leitura === versao) avisar('Não consegui abrir essa imagem. Tente uma foto JPG, PNG ou WebP.'); };
      const leitor = new FileReader();
      leitor.onload = () => {
        if (leitura !== versao) return;
        const imagem = new Image();
        imagem.onload = () => {
          if (leitura !== versao) return;
          try {
            const reduzir = (lado, qualidade) => {
              const escala = Math.min(1, lado / Math.max(imagem.naturalWidth, imagem.naturalHeight));
              const canvas = document.createElement('canvas');
              canvas.width = Math.max(1, Math.round(imagem.naturalWidth * escala));
              canvas.height = Math.max(1, Math.round(imagem.naturalHeight * escala));
              canvas.getContext('2d').drawImage(imagem, 0, 0, canvas.width, canvas.height);
              return canvas.toDataURL('image/jpeg', qualidade);
            };
            const foto = reduzir(1600, .82), pequena = reduzir(360, .74);
            fotoPreparada = foto; miniatura = pequena;
            preview.src = foto; preview.style.display = 'block'; bloquear(false);
            avisar('Foto pronta! Toque em Analisar imagem.');
          } catch (erro) { falhou(); }
        };
        imagem.onerror = falhou; imagem.src = String(leitor.result);
      };
      leitor.onerror = falhou; leitor.readAsDataURL(arquivo);
    }, true);
    input.addEventListener('click', () => { if (!identificando) input.value = ''; });
    analisar.addEventListener('click', async () => {
      if (identificando || !categoria || !fotoPreparada) return;
      if (location.protocol === 'file:') { avisar('A foto está pronta. Para identificar com IA, abra o aplicativo no site publicado.'); return; }
      limparFicha(); bloquear(true); avisar('🔎 O Zé Goiabinha está investigando sua foto...');
      const foto = fotoPreparada, pequena = miniatura;
      try {
        const resposta = await fetch('/api/identificar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grupo: 'ezio-t1t-enrico', body: {
            contents: [{ parts: [
              { text: 'Você é o Zé Goiabinha, guia da natureza brasileira para crianças. Identifique somente o que pertence à categoria selecionada: ' + categoria.name + ' (' + categoria.description + '). Se a foto estiver fora dessa categoria, use e_do_tema=false e identificado=false. Se não houver certeza, use identificado=false. Não invente uma espécie. Informe em português nome popular e científico quando possível, descrição, curiosidades, conservação, habitat e biomas. Preencha perigoso e aviso para orientar a observação segura. Nunca recomende consumir plantas, frutas ou fungos apenas por identificação visual.' },
              { inline_data: { mime_type: 'image/jpeg', data: foto.split(',')[1] } }
            ] }],
            generationConfig: { temperature: .2, responseMimeType: 'application/json', responseSchema: {
              type: 'object', properties: { identificado: { type: 'boolean' }, confianca: { type: 'integer' }, descricao: { type: 'string' }, perigoso: { type: 'boolean' }, aviso: { type: 'string' } },
              required: ['identificado', 'confianca', 'descricao', 'perigoso', 'aviso']
            } }
          } })
        });
        const dados = await resposta.json().catch(() => null);
        if (!resposta.ok) throw new Error(dados?.error?.message || (resposta.status === 404 ? 'O serviço de identificação não foi encontrado. Confira a publicação do aplicativo.' : 'O reconhecimento falhou (código ' + resposta.status + '). Tente novamente.'));
        const bruto = dados?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof bruto !== 'string') throw new Error('A IA não enviou uma identificação. Tente outra foto.');
        let info;
        try { info = JSON.parse(bruto); } catch (erro) { throw new Error('Não consegui ler a resposta da IA. Tente novamente.'); }
        if (!info || typeof info !== 'object') throw new Error('A resposta da IA está incompleta. Tente novamente.');
        const confianca = Number(info.confianca);
        const corte = Number.isFinite(Number(info.certeza_minima)) ? Number(info.certeza_minima) : 80;
        if (info.fora_do_tema || info.e_do_tema === false || info.identificado !== true || !Number.isFinite(confianca) || confianca < corte) {
          avisar(info.mensagem_backend || info.mensagem || 'Não consegui ter certeza. Tente uma foto mais nítida.'); return;
        }
        atual = { info, foto: pequena, salvo: false };
        $('speciesName').textContent = texto(info.nome_popular || info.nome, 'Descoberta');
        $('speciesText').textContent = [texto(info.nome_cientifico), texto(info.descricao)].filter(Boolean).join(' · ');
        $('curiosityText').textContent = texto(info.curiosidades, 'Curiosidades não confirmadas.');
        $('conservationText').textContent = texto(info.status_conservacao || info.conservacao, 'Informação não confirmada.');
        $('biomeText').textContent = [texto(info.habitat_descricao || info.habitat), texto(info.biomas)].filter(Boolean).join(' · ') || 'Biomas não confirmados.';
        $('confidence').textContent = 'Confiança: ' + confianca + '%';
        const biomas = Array.isArray(info.biomas) ? info.biomas.map(normalizar) : [];
        document.querySelectorAll('#biomeGrid .biome').forEach(el => el.classList.toggle('confirmed', biomas.includes(normalizar(el.querySelector('strong').textContent))));
        const aviso = texto(info.aviso || info.aviso_perigo);
        $('safetyNotice').textContent = aviso; $('safetyNotice').hidden = !aviso;
        avisar('Descoberta identificada! Você já pode salvá-la no Safari.');
      } catch (erro) {
        avisar(erro instanceof TypeError ? 'Não consegui conectar ao reconhecimento. Confira a internet e tente novamente.' : erro.message);
      } finally { bloquear(false); }
    });
    if (window.PokedexAdaptador) PokedexAdaptador.iniciar({
      icone: '🌿', fauna: true, cor: '#9cf36b', cor2: '#6de8dc', escuro: () => true,
      noturno: { fundo: '#06251f', texto: '#fff6d9', suave: '#c3e6d3' },
      carregando: '🔎 O Zé Goiabinha está investigando sua descoberta...', esconder: [],
      galeria: { depoisDe: 'label.file-label', input: '#photoInput', classe: 'btn secondary file-label' },
      salvar: salvarAtual,
      alerta: info => texto(info.aviso || info.aviso_perigo),
      extras: () => [['🔎 Categoria', categoria ? categoria.name : '']],
      novaFoto: () => { if (!identificando) { limparFoto(); avisar('Tire outra foto para começar.'); if (categoria) input.click(); } }
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bloquear(identificando));
    bloquear(false);
  }
  if ($('categoryGrid')) iniciarInicio();
  if ($('photoInput')) iniciarDescoberta();
})();
