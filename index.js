const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Render의 환경 변수(DATABASE_URL)를 사용하여 DB 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon 연결 시 필수 설정
  }
});

app.get('/', async (req, res) => {
  try {
    // 'test' 테이블에서 첫 번째 행 가져오기
    const result = await pool.query('SELECT name, age FROM test LIMIT 1');
    
    if (result.rows.length > 0) {
      const { name, age } = result.rows[0];
      res.send(`<h1>Hello ${name} (${age}세)</h1>`);
    } else {
      res.send('<h1>데이터가 없습니다.</h1>');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Database Error: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
