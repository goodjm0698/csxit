import "dotenv/config";
import { pool } from "../src/db";
import { inquiries } from "../../lib/inquiries";

async function seed() {
  await pool.query("DELETE FROM inquiries");

  const sql = `
    INSERT INTO inquiries (
      id,
      channel,
      customer_name,
      title,
      status,
      elapsed_time,
      category,
      product_name,
      order_number,
      ticket_number,
      wait_time,
      customer_initial,
      customer_tier,
      member_id,
      phone,
      email,
      joined_at,
      total_spent,
      total_orders,
      purchase_history,
      consult_history,
      conversation,
      ai_draft
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const inquiry of inquiries) {
    await pool.execute(sql, [
      Number(inquiry.id),
      inquiry.channel,
      inquiry.customerName,
      inquiry.title,
      inquiry.status,
      inquiry.elapsedTime,
      inquiry.category,
      inquiry.productName,
      inquiry.orderNumber,
      inquiry.ticketNumber,
      inquiry.waitTime,
      inquiry.customerInitial,
      inquiry.customerTier,
      inquiry.memberId,
      inquiry.phone,
      inquiry.email,
      inquiry.joinedAt,
      inquiry.totalSpent,
      inquiry.totalOrders,
      JSON.stringify(inquiry.purchaseHistory),
      JSON.stringify(inquiry.consultHistory),
      JSON.stringify(inquiry.conversation),
      inquiry.aiDraft,
    ]);
  }

  console.log(`Seed completed: ${inquiries.length} inquiries inserted`);
  await pool.end();
}

seed().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
