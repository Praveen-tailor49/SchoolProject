import db from '../db.js';

export const getAllPayments = async (req, res) => {
  try {
    const { method, status } = req.query;
    let query = `
      SELECT p.*, s.name as student_name, c.class_name 
      FROM payments p 
      LEFT JOIN students s ON p.student_id = s.student_id 
      LEFT JOIN classes c ON p.class_id = c.class_id
    `;
    const conditions = [];
    const params = [];

    if (method) {
      conditions.push("p.payment_method = ?");
      params.push(method);
    }
    if (status) {
      conditions.push("p.status = ?");
      params.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY p.payment_date DESC";

    const [payments] = await db.query(query, params);
    res.status(200).json({ data: payments, message: "Payments fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [payment] = await db.query(`
      SELECT p.*, s.name as student_name, c.class_name 
      FROM payments p 
      LEFT JOIN students s ON p.student_id = s.student_id 
      LEFT JOIN classes c ON p.class_id = c.class_id 
      WHERE p.payment_id = ?
    `, [id]);
    if (payment.length === 0) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ data: payment[0], message: "Payment fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { invoice_id, student_id, class_id, amount, payment_method, reference_number } = req.body;
    const status = payment_method === 'Cheque' ? 'Pending' : 'Completed';
    const paymentData = { 
      invoice_id, 
      student_id, 
      class_id, 
      amount, 
      payment_method, 
      reference_number,
      status,
      payment_date: new Date(),
      created_at: new Date() 
    };
    const [result] = await db.query("INSERT INTO payments SET ?", paymentData);

    if (invoice_id && status === 'Completed') {
      await db.query(
        "UPDATE invoices SET paid_amount = paid_amount + ? WHERE invoice_id = ?",
        [amount, invoice_id]
      );
      const [invoice] = await db.query("SELECT * FROM invoices WHERE invoice_id = ?", [invoice_id]);
      if (invoice.length > 0) {
        const newStatus = invoice[0].paid_amount >= invoice[0].amount ? 'Paid' : 'Partial';
        await db.query("UPDATE invoices SET status = ? WHERE invoice_id = ?", [newStatus, invoice_id]);
      }
    }

    res.status(201).json({ message: "Payment recorded successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query("UPDATE payments SET status = ? WHERE payment_id = ?", [status, id]);

    if (status === 'Completed') {
      const [payment] = await db.query("SELECT * FROM payments WHERE payment_id = ?", [id]);
      if (payment.length > 0 && payment[0].invoice_id) {
        await db.query(
          "UPDATE invoices SET paid_amount = paid_amount + ? WHERE invoice_id = ?",
          [payment[0].amount, payment[0].invoice_id]
        );
      }
    }

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_payments,
        SUM(amount) as total_amount,
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as completed_amount,
        SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END) as pending_amount,
        SUM(CASE WHEN payment_method = 'Cash' THEN amount ELSE 0 END) as cash_amount,
        SUM(CASE WHEN payment_method = 'Online' THEN amount ELSE 0 END) as online_amount,
        SUM(CASE WHEN payment_method = 'UPI' THEN amount ELSE 0 END) as upi_amount,
        SUM(CASE WHEN payment_method = 'Cheque' THEN amount ELSE 0 END) as cheque_amount
      FROM payments
    `);
    res.status(200).json({ data: stats[0], message: "Payment stats fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
