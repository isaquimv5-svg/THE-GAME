# THE-GAME — instruções para agentes de desenvolvimento (Codex)

## Missão
Evoluir o aplicativo **THE-GAME** existente para uma plataforma pessoal e empresarial do proprietário. Este NÃO é um projeto novo. O código atual é a fonte da verdade. A hospedagem de produção é o site Netlify **https://the-game.netlify.app**, já conectado pelo proprietário ao repositório **isaquimv5-svg/THE-GAME**.

## Estrutura existente
- Código em `focus-app (1)/`, não na raiz.
- React 19, TypeScript, Vite 8, Tailwind 4, Framer Motion e PWA.
- Componentes atuais em `src/components/`, estado em `src/context/AppContext.tsx`, modelo em `src/types/index.ts`.
- `src/utils/storage.ts` persiste registros de tarefas, hábitos, perfil, metas e desempenho em chaves `focus_app_*_v3` no localStorage.
- Configuração do Netlify em `netlify.toml`; build usa a pasta acima e publica `dist`.
- CI em `.github/workflows/verify-build.yml`.

## Regras de segurança e qualidade
1. Preserve todas as telas, capacidades, dados já salvos, navegação, PWA, identidade escura `#05090D`, azul `#299BFF`, cards arredondados, responsividade mobile-first e animações existentes.
2. NÃO apague dados do usuário nem renomeie as chaves do localStorage sem migração explícita e backup. Não introduza limpeza automática de v3. Faça evolução incremental compatível com formatos anteriores.
3. Antes de alterar persistência, entregue exportação/importação segura de backup validado, sem envio dos dados para terceiros.
4. Trabalhe em branches pequenas com PRs, rode `npm install --no-audit --no-fund`, `npm run lint`, `npm run build` e só integre à `main` após sucesso.
5. O site existente Netlify deve continuar no mesmo domínio. Não crie outro site, não troque DNS, não solicite senhas nem faça commits de credenciais.
6. Nunca declare publicação concluída sem evidência de deploy Netlify bem-sucedido. Se não houver acesso à Netlify, informe precisamente o bloqueio; commits e CI de GitHub não provam deploy.
7. Trate trabalho, produtividade e hábitos como sistema sustentável: não penalizar ausência de atividades não planejadas; proteger sono, família, almoço e descanso.
8. Não adicionar dados financeiros sensíveis em app público sem revisão de privacidade/autenticação e armazenamento adequado.
9. Registre ao final arquivos mudados, branch, commit, testes, estado real do deploy e qualquer pendência.

## Contextos de gestão
- **GF ATAKAREJO**: marketing, gravação/edição/agendamento de Stories e Reels, indicadores comerciais, demandas e delegação de atendimento/frete.
- **MTR7 Imports**: fundador é rosto da marca; criação de conteúdo, e-commerce, atendimento, pedidos, estoque, expedição, planejamento e finanças.
- **Pessoal**: família, saúde, sono, espiritualidade, casa, leitura e finanças pessoais.
- **Geral**: tarefas não classificadas e rotinas compartilhadas.

## Rotina-base flexível
O proprietário acorda às 06:00, sai às 08:00, trabalha em ambiente compartilhado das 08:30 às aproximadamente 18:00–18:30, almoça 13:00–14:30 e gasta 15–30 minutos no deslocamento. Ele pode trabalhar nos dois negócios durante o mesmo expediente. A meta inicial é reservar 22:00–06:00 para dormir, e preservar noite para a esposa e casa; os horários são editáveis. Prioridade inicial: regularidade do sono, não aumentar carga de trabalho.

## Roadmap de produto — continuar após a Rotina Inteligente
1. **Fundação e dados**: backup/exportação e importação validada, correção de tarefas recorrentes e histórico por data sem reset destrutivo.
2. **Rotina Inteligente**: blocos de horários editáveis por dia, tarefas flexíveis por bloco, áreas GF/MTR7/Pessoal, almoço/família/sono protegidos.
3. **Projetos e delegação**: projetos por área, responsável, status, prazo e lista de processos/automação.
4. **Metas**: objetivos maiores → metas trimestrais/mensais/semanais → prioridades do dia, com indicadores separados de hábitos.
5. **Dashboard e revisão**: painel de decisões diário/semana, pendências reais, progresso relevante, revisão de trabalho/saúde/família.
6. **Financeiro**: despesas pessoais e fluxo de caixa por empresa, faturamento vs lucro e repasses ao contador. Propor arquitetura segura antes de armazenar dados reais.
7. **Sincronização opcional**: autenticação e banco na nuvem só após decisão explícita do proprietário e plano de migração/backup.
8. **Automação e integração**: notificações, importação de agenda, processos repetitivos com permissão explícita.

## Critérios de aceitação
- Funciona em telas mobile e desktop, inclusive em PWA.
- Novos campos de tarefa são opcionais para não quebrar registros existentes.
- Tarefas antigas ainda aparecem em Geral.
- Blocos e tarefas reaparecem após recarregar a página no mesmo navegador.
- Nenhum dado fictício ou métrica inventada se mistura aos dados reais.
- Foco em ações concluíveis e métricas úteis, sem incentivar madrugadas de trabalho.
