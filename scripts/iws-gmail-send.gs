/**
 * Google Apps Script web app that sends IWS shipping-label PDFs from dennis@hcgamerlife.com.
 *
 * Deploy: Web app, execute as Me, who has access Anyone.
 * Script properties: IWS_GMAIL_SCRIPT_SECRET
 *
 * The hc-gamer-life Worker POSTs JSON:
 * { secret, from, to, subject, text, attachments: [{ filename, contentBase64, mimeType }] }
 */
function doPost(event) {
  const raw = event.postData && event.postData.contents;
  if (!raw) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "empty" })).setMimeType(
      ContentService.MimeType.JSON
    );
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch (error) {
    return json_({ ok: false, error: "invalid_json" });
  }

  const expected = PropertiesService.getScriptProperties().getProperty("IWS_GMAIL_SCRIPT_SECRET");
  if (!expected || body.secret !== expected) {
    return json_({ ok: false, error: "unauthorized" });
  }

  const to = [].concat(body.to || []).filter(Boolean);
  if (!to.length || !body.subject || !body.text) {
    return json_({ ok: false, error: "missing_fields" });
  }

  const attachments = (body.attachments || []).map(function (file) {
    const bytes = Utilities.base64Decode(file.contentBase64);
    const blob = Utilities.newBlob(bytes, file.mimeType || "application/pdf", file.filename || "shipping-label.pdf");
    return blob;
  });

  GmailApp.sendEmail(to.join(","), body.subject, body.text, {
    from: body.from || "dennis@hcgamerlife.com",
    name: "HC GamerLife",
    attachments: attachments
  });

  return json_({ ok: true });
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
