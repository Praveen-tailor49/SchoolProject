import db from '../db.js';

export const getAllInvoices = async (req, res) => {
  try {
    const { status, class_id } = req.query;
    let query = "SELECT i.*, s.name as student_name, c.class_name, c.section FROM invoices i LEFT JOIN students s ON i.student_id = s.student_id LEFT JOIN classes c ON i.class_id = c.class_id";
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push("i.status = ?");
      params.push(status);
    }
    if (class_id) {
      conditions.push("i.class_id = ?");
      params.push(class_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY i.created_at DESC";

    const [invoices] = await db.query(query, params);
    res.status(200).json({ data: invoices, message: "Invoices fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [invoice] = await db.query(`
      SELECT i.*, s.name as student_name, c.class_name, c.section 
      FROM invoices i 
      LEFT JOIN students s ON i.student_id = s.student_id 
      LEFT JOIN classes c ON i.class_id = c.class_id 
      WHERE i.invoice_id = ?
    `, [id]);
    if (invoice.length === 0) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({ data: invoice[0], message: "Invoice fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { student_id, class_id, amount, paid_amount, due_date, fee_type } = req.body;
    const status = getInvoiceStatus(amount, paid_amount || 0, due_date);
    const invoiceData = { 
      student_id, 
      class_id, 
      amount, 
      paid_amount: paid_amount || 0, 
      due_date, 
      fee_type,
      status,
      created_at: new Date() 
    };
    const [result] = await db.query("INSERT INTO invoices SET ?", invoiceData);
    res.status(201).json({ message: "Invoice created successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, class_id, amount, paid_amount, due_date, fee_type } = req.body;
    const status = getInvoiceStatus(amount, paid_amount, due_date);
    await db.query(
      "UPDATE invoices SET student_id = ?, class_id = ?, amount = ?, paid_amount = ?, due_date = ?, fee_type = ?, status = ? WHERE invoice_id = ?",
      [student_id, class_id, amount, paid_amount, due_date, fee_type, status, id]
    );
    res.status(200).json({ message: "Invoice updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM invoices WHERE invoice_id = ?", [id]);
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getInvoiceStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_invoices,
        SUM(amount) as total_amount,
        SUM(paid_amount) as collected_amount,
        SUM(amount - paid_amount) as pending_amount,
        SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN status = 'Unpaid' THEN 1 ELSE 0 END) as unpaid_count,
        SUM(CASE WHEN status = 'Partial' THEN 1 ELSE 0 END) as partial_count,
        SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue_count
      FROM invoices
    `);
    res.status(200).json({ data: stats[0], message: "Invoice stats fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function getInvoiceStatus(amount, paidAmount, dueDate) {
  if (paidAmount >= amount) return 'Paid';
  if (new Date(dueDate) < new Date() && paidAmount < amount) return 'Overdue';
  if (paidAmount > 0) return 'Partial';
  return 'Unpaid';
}
