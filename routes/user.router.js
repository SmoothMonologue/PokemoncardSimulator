import express from "express";
import { prisma } from "../utils/prisma/prismaClient";

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

// 회원 가입 API
router.post("/users", async (req, res, next) => {
  const { userId, userName, password } = req.body;
  const user = await prisma.user.create({
    data: {
      userId,
      userName,
      password,
    },
  });

  return res.status(201).json({ data: user });
});

/** 유저 전체 조회, 확인용 **/
router.get("/users", async (req, res, next) => {
  const user = await prisma.user.findMany({
    select: {
      userId: true,
      userName: true,
    },
  });

  return res.status(200).json({ data: user });
});

/** 사용자 개인 정보 확인 API **/
router.get("/users/:userId", async (req, res, next) => {
  const { userId } = req.params;

  const user = await prisma.user.findFirst({ where: { userId: +userId } });

  return res.status(200).json({ data: user });
});

/** 회원 탈퇴 API **/
router.delete("/users/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const { password } = req.body;

  const user = await prisma.user.findFirst({ where: { userId: +userId } });

  if (!user)
    return res.status(404).json({ message: "회원이 존재하지 않습니다." });
  else if (user.password !== password)
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  await prisma.user.delete({ where: { userId: +userId } });

  return res.status(200).json({ data: "탈퇴가 완료되었습니다." });
});

// 카드 생성, 고정된 데이터, 유저가 접근할 수 없어야 함
router.post("/cards", async (req, res, next) => {
  const {
    cardId,
    cardName,
    cardType,
    cardHP,
    cardCharacter,
    cardMove1,
    cardMove2,
    cardWeak,
    cardCost,
  } = req.body;
  const pokemoncard = await prisma.pokemoncard.create({
    data: {
      cardId,
      cardName,
      cardType,
      cardHP,
      cardCharacter,
      cardMove1,
      cardMove2,
      cardWeak,
      cardCost,
    },
  });

  return res.status(201).json({ data: pokemoncard });
});

/** 포케카 전체 조회 API **/
router.get("/cards", async (req, res, next) => {
  const pokemoncard = await prisma.pokemoncard.findMany({
    select: {
      cardName: true,
      cardType: true,
      cardHP: true,
      cardCharacter: true,
      cardMove1: true,
      cardMove2: true,
      cardWeak: true,
      cardCost: true,
    },
  });

  return res.status(200).json({ data: pokemoncard });
});

export default router;
