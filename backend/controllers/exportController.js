import { supabase } from '../config/supabase.js';
import { Parser }   from 'json2csv';
import PDFDocument  from 'pdfkit';

// ── Shared: fetch all user transactions ───────────────────
async function fetchTransactions(userId, query = {}) {
  let q = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (query.start_date) q = q.gte('date', query.start_date);
  if (query.end_date)   q = q.lte('date', query.end_date);
  if (query.type)       q = q.eq('type', query.type);
  if (query.category)   q = q.eq('category', query.category);

  const { data, error } = await q.limit(5000);
  if (error) throw new Error(error.message);
  return data || [];
}

// ── GET /api/export/csv ───────────────────────────────────
export const exportCSV = async (req, res) => {
  try {
    const txns = await fetchTransactions(req.user.id, req.query);

    if (!txns.length) {
      return res.status(404).json({ error: 'No transactions found to export' });
    }

    const fields = ['date', 'type', 'category', 'amount', 'notes', 'created_at'];
    const parser = new Parser({ fields });
    const csv    = parser.parse(txns);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="finsight-transactions.csv"');
    res.status(200).send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
};

// ── GET /api/export/pdf ───────────────────────────────────
export const exportPDF = async (req, res) => {
  try {
    const txns = await fetchTransactions(req.user.id, req.query);

    // Summary
    const totalIncome  = txns.filter(t => t.type === 'income') .reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const balance      = totalIncome - totalExpense;

    const fmt = (n) => `Rs. ${Math.round(n).toLocaleString('en-IN')}`;
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="finsight-report.pdf"');
    doc.pipe(res);

    // ── Header ──
    doc.rect(0, 0, doc.page.width, 80).fill('#0f1224');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(22).text('FinSight', 50, 22);
    doc.fillColor('#94a3b8').font('Helvetica').fontSize(11)
       .text('Financial Report', 50, 48);
    doc.fillColor('#22d3ee').fontSize(11)
       .text(`Generated: ${new Date().toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' })}`, 350, 48);

    // ── Summary cards ──
    doc.moveDown(3);
    const cardY = 100;
    const cards = [
      { label: 'Total Income',  value: fmt(totalIncome),  color: '#10b981' },
      { label: 'Total Expenses', value: fmt(totalExpense), color: '#f43f5e' },
      { label: 'Net Balance',   value: fmt(balance),      color: balance >= 0 ? '#6366f1' : '#f59e0b' },
    ];
    cards.forEach((c, i) => {
      const x = 50 + i * 167;
      doc.rect(x, cardY, 152, 60).fillAndStroke('#0a0c1a', '#1e293b');
      doc.fillColor(c.color).font('Helvetica-Bold').fontSize(10).text(c.label, x + 10, cardY + 10);
      doc.fillColor('#ffffff').fontSize(14).text(c.value, x + 10, cardY + 28);
    });

    // ── Table header ──
    const tableTop = cardY + 80;
    doc.rect(50, tableTop, 495, 24).fill('#0f1224');
    doc.fillColor('#94a3b8').font('Helvetica-Bold').fontSize(9);
    const cols = [
      { label: 'DATE',     x: 58  },
      { label: 'CATEGORY', x: 130 },
      { label: 'TYPE',     x: 250 },
      { label: 'NOTES',    x: 320 },
      { label: 'AMOUNT',   x: 465, align: 'right' },
    ];
    cols.forEach(c => doc.text(c.label, c.x, tableTop + 8, { width: 80, align: c.align || 'left' }));

    // ── Table rows ──
    let rowY = tableTop + 28;
    const maxRows = Math.min(txns.length, 100);

    txns.slice(0, maxRows).forEach((t, i) => {
      if (rowY > doc.page.height - 80) {
        doc.addPage();
        rowY = 50;
      }
      if (i % 2 === 0) doc.rect(50, rowY - 4, 495, 20).fill('#0a0c1a');

      const color = t.type === 'income' ? '#10b981' : '#f43f5e';
      const sign  = t.type === 'income' ? '+' : '-';

      doc.fillColor('#e2e8f0').font('Helvetica').fontSize(9)
         .text(t.date, 58, rowY, { width: 65 })
         .text(t.category, 130, rowY, { width: 115 })
         .text(t.type, 250, rowY, { width: 65 });
      doc.fillColor('#94a3b8')
         .text((t.notes || '—').slice(0, 30), 320, rowY, { width: 135 });
      doc.fillColor(color).font('Helvetica-Bold')
         .text(`${sign}${fmt(t.amount)}`, 458, rowY, { width: 87, align: 'right' });

      rowY += 22;
    });

    if (txns.length > maxRows) {
      doc.fillColor('#475569').fontSize(9)
         .text(`... and ${txns.length - maxRows} more transactions. Export CSV for full data.`, 50, rowY + 8);
    }

    // ── Footer ──
    doc.fontSize(8).fillColor('#475569')
       .text('FinSight • Financial Analytics Dashboard', 50, doc.page.height - 40, { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('PDF export error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Failed to export PDF' });
  }
};
