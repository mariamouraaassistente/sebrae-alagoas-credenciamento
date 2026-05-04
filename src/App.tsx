import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FileSearch,
  HelpCircle,
  Layers3,
  ShieldCheck,
  Users,
} from 'lucide-react'

const officialLinks = [
  {
    label: 'Portal de credenciamento',
    href: 'https://credenciamento.sebrae.al/',
    note: 'Canal oficial para inscrições e edital permanente.',
  },
  {
    label: 'Notícia oficial ASN Alagoas',
    href: 'https://al.agenciasebrae.com.br/cultura-empreendedora/sebrae-alagoas-abre-credenciamento-para-consultores-e-instrutores-em-2025/',
    note: 'Resumo público do fluxo e dos critérios.',
  },
]

type Step = {
  title: string
  short: string
  whatYouDo: string
  whatSebraeDoes: string
  result: string
}

type ProfileId = 'consultor' | 'instrutor' | 'empresa'

type ChecklistItem = {
  label: string
  details: string
}

type FaqItem = {
  q: string
  a: string
}

const profiles: {
  id: ProfileId
  title: string
  eyebrow: string
  description: string
  accent: string
}[] = [
  {
    id: 'consultor',
    title: 'Consultor',
    eyebrow: 'Mais comum no edital',
    description: 'Quem vai prestar consultoria especializada para MEI, ME e EPP.',
    accent: 'from-cyan-400/30 to-emerald-400/20',
  },
  {
    id: 'instrutor',
    title: 'Instrutor',
    eyebrow: 'Cursos, oficinas e palestras',
    description: 'Quem atua em instrutoria e capacitação de turmas e eventos.',
    accent: 'from-violet-400/30 to-fuchsia-400/20',
  },
  {
    id: 'empresa',
    title: 'Empresa parceira',
    eyebrow: 'Credenciamento de PJ',
    description: 'A empresa entra no banco de fornecedores e pode atender demandas do Sebrae.',
    accent: 'from-amber-400/30 to-orange-400/20',
  },
]

const steps: Step[] = [
  {
    title: '1. Ler o edital e conferir o perfil',
    short: 'Entenda se o credenciamento está aberto e qual trilha você quer seguir.',
    whatYouDo:
      'Você lê o edital, confere o objeto do credenciamento e separa a categoria que faz sentido para o seu negócio.',
    whatSebraeDoes:
      'O Sebrae informa as regras, critérios mínimos, documentos aceitos e prazos de inscrição no edital permanente.',
    result: 'Você sabe exatamente o que pode fazer e evita entrar na trilha errada.',
  },
  {
    title: '2. Reunir documentos e comprovações',
    short: 'Junte tudo que prova experiência, CNAE e capacidade técnica.',
    whatYouDo:
      'Você separa documentos da empresa e dos responsáveis, além de portfólio, comprovação de experiência e dados cadastrais.',
    whatSebraeDoes:
      'A equipe confere se os arquivos enviados batem com o edital e se o CNAE é compatível com a área de atuação.',
    result: 'O cadastro fica pronto para análise documental.',
  },
  {
    title: '3. Preencher a inscrição no Hub Sebrae',
    short: 'É a etapa de envio oficial da candidatura.',
    whatYouDo:
      'Você acessa o Hub Sebrae, preenche os campos, envia os anexos e confirma que a proposta ficou completa.',
    whatSebraeDoes:
      'O sistema registra a inscrição e encaminha o pacote para validação da equipe responsável.',
    result: 'Sua candidatura entra na fila de análise.',
  },
  {
    title: '4. Análise documental e técnica',
    short: 'O Sebrae valida se você atende aos requisitos mínimos.',
    whatYouDo:
      'Se houver pendência, você corrige o que faltar e acompanha os comunicados do portal.',
    whatSebraeDoes:
      'A análise verifica documentação, experiência, compatibilidade de atividade e critérios mínimos do edital.',
    result: 'Seu nome pode seguir para habilitação ou receber exigência de ajuste.',
  },
  {
    title: '5. Divulgação do resultado e credenciamento',
    short: 'Se aprovado, você entra no banco de fornecedores credenciados.',
    whatYouDo:
      'Você acompanha o resultado e, se aprovado, mantém os dados atualizados para ser chamado quando surgirem demandas.',
    whatSebraeDoes:
      'O Sebrae publica o resultado e atualiza a base de credenciados para futuras contratações e chamadas.',
    result: 'Você passa a compor o ecossistema de consultores/instrutores aptos a atender o Sebrae.',
  },
  {
    title: '6. Recadastramento e manutenção',
    short: 'Quem já participou antes precisa atualizar a situação quando o edital pedir.',
    whatYouDo:
      'Se o edital exigir, você recadastra sua empresa, atualiza documentos e confirma que continua apto.',
    whatSebraeDoes:
      'O Sebrae mantém a base atualizada para não trabalhar com cadastro desatualizado.',
    result: 'Seu credenciamento continua válido e pronto para uso.',
  },
]

const criteria = [
  'CNAE compatível com a área de atuação',
  'Experiência comprovada na prestação do serviço',
  'Mínimo de 3 anos de atuação no mercado',
  'Documentação em dia e arquivos legíveis',
  'Recadastro quando o edital vigente exigir',
]

const checklist: ChecklistItem[] = [
  {
    label: 'Dados da empresa',
    details: 'CNPJ, razão social, endereço e contatos atualizados.',
  },
  {
    label: 'Comprovação de experiência',
    details: 'Portfólio, atestados, contratos ou materiais que mostrem atuação real.',
  },
  {
    label: 'Compatibilidade de CNAE',
    details: 'A atividade cadastrada precisa conversar com o serviço ofertado.',
  },
  {
    label: 'Documentos do responsável',
    details: 'Documento de identificação, CPF e, se o edital pedir, currículo resumido.',
  },
  {
    label: 'Arquivos organizados',
    details: 'PDFs nomeados direitinho para não travar a análise documental.',
  },
]

const mistakes = [
  'Querer se inscrever sem ler o edital completo.',
  'Enviar CNAE que não bate com o serviço.',
  'Esquecer comprovação de experiência.',
  'Mandar arquivo ilegível ou vencido.',
  'Ignorar o recadastro quando ele for exigido.',
]

const faq: FaqItem[] = [
  {
    q: 'O credenciamento fica aberto só em uma data?',
    a: 'No material público consultado, o edital aparece como permanente, então novos interessados podem se candidatar ao longo do ano.',
  },
  {
    q: 'Quem o Sebrae quer cadastrar?',
    a: 'Empresas especializadas para consultoria e instrutoria, capazes de atender MEI, ME e EPP.',
  },
  {
    q: 'Quais são as etapas resumidas?',
    a: 'Inscrição e envio de documentação, análise documental e divulgação dos resultados.',
  },
  {
    q: 'Se eu já participei antes, preciso fazer tudo de novo?',
    a: 'O material público informa que participantes de editais anteriores devem se recadastrar conforme as regras vigentes.',
  },
]

function App() {
  const [profileId, setProfileId] = useState<ProfileId>('consultor')
  const [stepIndex, setStepIndex] = useState(0)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const currentProfile = profiles.find((item) => item.id === profileId) ?? profiles[0]
  const currentStep = steps[stepIndex]
  const checkedCount = Object.values(checked).filter(Boolean).length
  const progress = Math.round((checkedCount / checklist.length) * 100)

  const readyMessage = useMemo(() => {
    if (progress === 100) return 'Checklist básico concluído. Você já pode usar o fluxo para estudar o edital.'
    if (progress >= 60) return 'Você está quase pronto. Falta só revisar o restante da documentação.'
    return 'Comece pela documentação principal e pela leitura do edital.'
  }, [progress])

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-badge">
          <ShieldCheck size={16} />
          <span>Guia didático do credenciamento Sebrae Alagoas</span>
        </div>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">SEBRAE ALAGOAS · Fluxo de credenciamento</p>
            <h1>Entenda, passo a passo, como a pessoa/empresa se credencia no Sebrae Alagoas.</h1>
            <p className="lead">
              Baseado em conteúdo público do Sebrae Alagoas: o edital é permanente, o processo tem três etapas
              principais e o foco é credenciar consultores e instrutores para atender MEI, ME e EPP.
            </p>

            <div className="hero-actions">
              {officialLinks.map((link) => (
                <a key={link.href} className="pill-link" href={link.href} target="_blank" rel="noreferrer">
                  <span>
                    <ExternalLink size={16} />
                    {link.label}
                  </span>
                  <small>{link.note}</small>
                </a>
              ))}
            </div>
          </div>

          <div className="stats-card">
            <div className="stat">
              <span>Etapas oficiais</span>
              <strong>3</strong>
            </div>
            <div className="stat">
              <span>Perfil principal</span>
              <strong>Consultor / Instrutor</strong>
            </div>
            <div className="stat">
              <span>Janelas de inscrição</span>
              <strong>Ao longo do ano</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-strip">
        {profiles.map((profile) => {
          const active = profile.id === profileId
          return (
            <button
              key={profile.id}
              type="button"
              className={`profile-card ${active ? 'active' : ''}`}
              onClick={() => setProfileId(profile.id)}
            >
              <span className={`profile-glow ${profile.accent}`} />
              <small>{profile.eyebrow}</small>
              <strong>{profile.title}</strong>
              <p>{profile.description}</p>
            </button>
          )
        })}
      </section>

      <section className="content-grid">
        <div className="panel flow-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Fluxo resumido</p>
              <h2>Trilha principal do credenciamento</h2>
            </div>
            <div className="panel-icon">
              <Layers3 size={18} />
            </div>
          </div>

          <div className="timeline">
            {steps.map((step, index) => {
              const active = index === stepIndex
              return (
                <button
                  key={step.title}
                  type="button"
                  className={`timeline-item ${active ? 'active' : ''}`}
                  onClick={() => setStepIndex(index)}
                >
                  <span className="timeline-index">{index + 1}</span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.short}</small>
                  </span>
                  <ChevronRight size={18} />
                </button>
              )
            })}
          </div>

          <article className="step-detail">
            <div className="step-detail-top">
              <div>
                <p className="eyebrow">Etapa selecionada</p>
                <h3>{currentStep.title}</h3>
              </div>
              <BadgeCheck size={22} />
            </div>

            <p className="detail-lead">{currentStep.short}</p>

            <div className="detail-columns">
              <div>
                <h4>O que você faz</h4>
                <p>{currentStep.whatYouDo}</p>
              </div>
              <div>
                <h4>O que o Sebrae confere</h4>
                <p>{currentStep.whatSebraeDoes}</p>
              </div>
            </div>

            <div className="result-box">
              <strong>Resultado esperado</strong>
              <p>{currentStep.result}</p>
            </div>
          </article>
        </div>

        <aside className="side-column">
          <section className="panel criteria-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Requisitos citados publicamente</p>
                <h2>O que a empresa precisa ter</h2>
              </div>
              <div className="panel-icon soft">
                <FileSearch size={18} />
              </div>
            </div>

            <ul className="bullet-list">
              {criteria.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="note-box">
              <CircleAlert size={18} />
              <p>
                O processo público consultado informa três etapas principais: <strong>inscrição e envio de
                documentação</strong>, <strong>análise documental</strong> e <strong>divulgação dos resultados</strong>.
              </p>
            </div>
          </section>

          <section className="panel checklist-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Checklist de estudo</p>
                <h2>O que separar antes de enviar</h2>
              </div>
              <div className="panel-icon soft">
                <BookOpenText size={18} />
              </div>
            </div>

            <div className="progress-wrap">
              <div className="progress-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
              <p>
                {checkedCount}/{checklist.length} itens marcados · {progress}%
              </p>
            </div>

            <div className="checklist">
              {checklist.map((item) => {
                const isChecked = Boolean(checked[item.label])
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`check-item ${isChecked ? 'checked' : ''}`}
                    onClick={() => setChecked((current) => ({ ...current, [item.label]: !current[item.label] }))}
                  >
                    <span className="check-box">
                      {isChecked ? <CheckCircle2 size={16} /> : <span />}
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.details}</small>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="ready-box">
              <strong>{readyMessage}</strong>
              <p>Se quiser estudar de forma prática, marque os itens e avance o fluxo etapa por etapa.</p>
            </div>
          </section>
        </aside>
      </section>

      <section className="bottom-grid">
        <section className="panel micro-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Perfil selecionado</p>
              <h2>{currentProfile.title}</h2>
            </div>
            <div className="panel-icon soft">
              <Users size={18} />
            </div>
          </div>

          <div className="mini-cards">
            <div>
              <span>Quem é esse perfil?</span>
              <strong>{currentProfile.description}</strong>
            </div>
            <div>
              <span>Bom lembrar</span>
              <strong>
                O edital pode pedir recadastro se a empresa já tiver participado antes.
              </strong>
            </div>
            <div>
              <span>Dica prática</span>
              <strong>Use arquivos organizados e nomeados de forma clara para facilitar a análise.</strong>
            </div>
          </div>
        </section>

        <section className="panel faq-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Perguntas rápidas</p>
              <h2>O que mais costuma confundir</h2>
            </div>
            <div className="panel-icon soft">
              <HelpCircle size={18} />
            </div>
          </div>

          <div className="faq-list">
            {faq.map((item) => (
              <details key={item.q}>
                <summary>
                  <span>{item.q}</span>
                  <ArrowRight size={16} />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </section>

      <section className="panel mistakes-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Erros comuns</p>
            <h2>Evite estes tropeços</h2>
          </div>
          <div className="panel-icon soft">
            <CircleAlert size={18} />
          </div>
        </div>

        <div className="mistakes-grid">
          {mistakes.map((item, index) => (
            <div key={item} className="mistake-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer-card">
        <div>
          <strong>Base pública usada neste guia</strong>
          <p>
            Fonte oficial consultada: notícia da ASN Alagoas sobre o credenciamento 2025 e o portal de
            credenciamento do Sebrae Alagoas.
          </p>
        </div>
        <a className="footer-link" href={officialLinks[0].href} target="_blank" rel="noreferrer">
          Abrir portal oficial
          <ExternalLink size={16} />
        </a>
      </footer>
    </main>
  )
}

export default App
