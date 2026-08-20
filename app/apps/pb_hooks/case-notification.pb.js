function notifyCase(e, action) {
  try {
    const message = new MailerMessage({
      from: { name: "Dhage & Associates Website" },
      to: [{ address: "amrutdhage21@gmail.com" }],
      subject: `Case ${action}: ${e.record.get("title")}`,
      html: `
        <h2>Case ${action}</h2>
        <p><strong>${e.record.get("title")}</strong></p>
        <p>Court: ${e.record.get("court") || "-"}<br/>
        Case number: ${e.record.get("case_number") || "-"}<br/>
        Status: ${e.record.get("status") || "-"}</p>
        <p>${(e.record.get("introduction") || "").substring(0, 500)}</p>
      `,
    });
    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error("case notification failed", "err", String(err));
  }
}

onRecordAfterCreateSuccess((e) => {
  try {
    const message = new MailerMessage({
      from: { name: "Dhage & Associates Website" },
      to: [{ address: "amrutdhage21@gmail.com" }],
      subject: `New case added: ${e.record.get("title")}`,
      html: `<h2>New case added</h2><p><strong>${e.record.get("title")}</strong></p><p>Court: ${e.record.get("court") || "-"}</p>`,
    });
    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error("case create notification failed", "err", String(err));
  }
  e.next();
}, "cases");

onRecordAfterUpdateSuccess((e) => {
  try {
    const message = new MailerMessage({
      from: { name: "Dhage & Associates Website" },
      to: [{ address: "amrutdhage21@gmail.com" }],
      subject: `Case updated: ${e.record.get("title")}`,
      html: `<h2>Case updated</h2><p><strong>${e.record.get("title")}</strong></p><p>Status: ${e.record.get("status") || "-"}</p>`,
    });
    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error("case update notification failed", "err", String(err));
  }
  e.next();
}, "cases");

void notifyCase;
