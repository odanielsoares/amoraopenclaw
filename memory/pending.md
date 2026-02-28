# Pendências (atualizado)

- [ ] Validar estabilidade por 15–30 minutos (sem connect() failed no nginx) — Dono: Amora (executor)
- [ ] Confirmar que todos os clientes em teste (incluindo os do Dan) foram limpos de service workers e cache — Dono: Dan/Amora
- [ ] Finalizar criação de usuário(s) persistentes (email/senha) no backend ou manter token local como método de acesso — Dono: Dan/Amora
- [ ] Revisar política de exposure: bloquear permanentemente /chat e /sessions até integrar autenticação e autorização de gateway — Dono: Amora
- [ ] Documentar deploy final (nginx conf, pm2 commands, logs path) e commitar no repo privado (sem secrets) — Dono: Amora
- [ ] Se o OpenClaw Gateway exigir credenciais adicionais, colocar token seguro no secret manager e apontar BACKEND/.env — Dono: Dan (fornecer token) / Amora (configurar)

