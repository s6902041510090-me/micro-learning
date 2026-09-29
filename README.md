# CONTEXT.md — Micro Learning Platform

Domain glossary. No implementation details. Updated as terms are resolved.

---

## Roles

**Guest** — ผู้เยี่ยมชมที่ยังไม่ได้ล็อกอิน สามารถดูรายการ Lesson และ metadata (ชื่อ, thumbnail, คำอธิบาย) ได้ แต่ไม่สามารถเริ่มเรียนได้

**Student** — ผู้ใช้ที่ล็อกอินแล้วและมี role เป็น student สามารถเรียน Lesson, ทำ Quiz, ดู Progress ของตัวเองได้

**Teacher** — ผู้ใช้ที่ล็อกอินแล้วและมี role เป็น teacher สามารถสร้าง, แก้ไข, Publish, Unpublish, และ Soft Delete Lesson ของตัวเองได้

---

## Core Domain Terms

**Micro Lesson** (เรียกย่อว่า "Lesson") — หน่วยการเรียนรู้แบบ standalone ที่ออกแบบให้เรียนจบได้ภายใน 3–5 นาที ประกอบด้วย Cards เรียงตามลำดับ

**Card** — หน่วยเนื้อหาชิ้นเดียวภายใน Lesson มี 3 ประเภท: TextImage, Slide, Quiz

**TextImage Card** — Card ที่มีหัวข้อ, เนื้อหาข้อความ, และรูปภาพ (optional)

**Slide Card** — Card ที่แสดงรูปภาพหรือ infographic พร้อม caption (optional)

**Quiz Card** — Card ที่มีคำถาม 1 ข้อ, ตัวเลือก 4 ข้อ, เฉลยที่ถูกต้อง 1 ข้อ, และคำอธิบายเฉลย (optional)

---

## Scoring & Completion

**Quiz Score** — คะแนน (%) ที่ได้จาก Attempt หนึ่งครั้ง คำนวณจาก: `(จำนวน Quiz Card ที่ตอบถูก / จำนวน Quiz Card ทั้งหมดใน Lesson) × 100`

**Passing Score** — คะแนนขั้นต่ำ (%) ที่ต้องได้เพื่อให้ Lesson นั้น Completed ค่า default คือ 70% Teacher สามารถกำหนดเองได้ต่อ Lesson ในช่วง 0–100%

**Best Score** — คะแนนสูงสุดที่ Student เคยได้จากทุก Attempt บน Lesson นั้น ใช้เปรียบเทียบกับ Passing Score

**Attempt** — การทำ Quiz Cards ของ Lesson หนึ่งรอบ ไม่ว่าจะผ่านหรือไม่ก็ตาม

**Completion** — สถานะของ Lesson สำหรับ Student คนหนึ่ง เกิดขึ้นเมื่อ Best Score ≥ Passing Score

> Lesson จะต้องมี Quiz Card อย่างน้อย 1 ใบ จึงจะ Publish ได้

---

## Progress States

**Not Started** — Student ยังไม่เคยเปิด Lesson นั้นเลย

**In-Progress** — Student เปิด Lesson แล้วแต่ยัง ไม่ Completed (Best Score < Passing Score หรือยังไม่เคย Attempt)

**Completed** — Student มี Best Score ≥ Passing Score

---

## Lesson Lifecycle

**Draft** — Lesson ที่ Teacher กำลังสร้าง ยังไม่ถูก Publish ไม่ปรากฏใน catalog

**Published** — Lesson ที่ Teacher กด Publish แล้ว ปรากฏใน catalog สำหรับ Guest และ Student

**Unpublished** — Lesson ที่เคย Publish แล้วถูก Teacher ซ่อน หายจาก catalog แต่ Student ที่เคยเริ่มเรียนยังเห็นใน Dashboard ของตัวเองพร้อม label "ไม่พร้อมใช้งาน" และไม่สามารถเข้าเรียนต่อได้

**Soft Delete** — การลบ Lesson โดย Teacher ซึ่งเป็นการซ่อน Lesson จาก catalog และทำให้เข้าถึงไม่ได้ แต่ข้อมูล Progress ของ Student ที่เคยเรียนยังคงอยู่ใน database ไม่ถูกลบ

---

## Retake

**Retake** — การทำ Quiz อีกครั้งหลัง Attempt แรก Student เลือกได้ว่าจะ "เรียนใหม่ทั้งหมด" (เริ่มตั้งแต่ Card แรก) หรือ "ทำแบบทดสอบอีกครั้ง" (ข้ามไปยัง Quiz Cards โดยตรง) ระบบบันทึก Best Score เสมอ

---

## Organization

**Category** — หมวดหมู่หลักของ Lesson กำหนดโดยระบบ (fixed list) ได้แก่:
`วิทย์`, `คณิต`, `ภาษาไทย`, `ภาษาอังกฤษ`, `สังคม`, `เทคโนโลยี`, `ทักษะชีวิต`, `อื่นๆ`

**Tag** — ป้ายชื่อที่ Teacher กำหนดเองได้อย่างอิสระ (free-form) เพื่อช่วยใน search และ filter เพิ่มเติมจาก Category

---

## Authentication

ระบบรองรับ 2 วิธีล็อกอิน: Email + Password และ Google Sign-In
Role (Student / Teacher) กำหนดตอน Register และเก็บใน database ฝั่ง server เท่านั้น ไม่ trust role จาก client

---

*Last updated: 2026-09-29*
