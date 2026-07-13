"use client";

import React, { useState, useEffect } from "react";
import QuizData from "./data";
import { Button, Card, CardBody } from "@heroui/react";
import { formatTime } from "utils";
import { ClockIcon } from "@heroicons/react/24/outline";
import shuffle from "lodash/shuffle";
import { useReward } from "react-rewards";

function Quiz() {
  const PASSING_GRADE: number = 80;
  const QUESTION_SECONDS: number = 30;
  const NUMBER_OF_QUESTIONS: number = 20;
  const CORRECT_ANSWER_SCORE: number = 5;

  const [questions, setQuestions] = useState(
    shuffle(QuizData.questions).slice(0, NUMBER_OF_QUESTIONS)
  );
  const [question, setQuestion] = useState<string>("");
  const [choices, setChoices] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState(false);
  const [showStartScreen, setShowStartScreen] =
    useState<boolean>(true);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<
    number | null
  >(null);
  const [timer, setTimer] = useState<number>(QUESTION_SECONDS * NUMBER_OF_QUESTIONS);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0
  });
  const [isRewardComplete, setIsRewardComplete] =
    useState<boolean>(false);
  const { reward } = useReward("rewardId", "confetti", {
    lifetime: 500,
    elementCount: 400,
    spread: 90,
    startVelocity: 30
  });

  /**
   * 次の問題ボタン
   */
  const onClickNext = () => {
    setSelectedAnswerIndex(null);
    setResult(prev =>
      selectedAnswer
        ? {
          ...prev,
          score: prev.score + CORRECT_ANSWER_SCORE,
          correctAnswers: prev.correctAnswers + 1
        }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    );
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion(prev => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
    }
  };

  /**
   * 開始ボタン
   */
  const onClickStart = () => {
    setShowStartScreen(false);
    setShowResult(false);
    setActiveQuestion(0);
    setQuestions(shuffle(QuizData.questions).slice(0, NUMBER_OF_QUESTIONS));
    setTimer(QUESTION_SECONDS * NUMBER_OF_QUESTIONS);
  };

  /**
   * 再挑戦ボタン
   */
  const onClickRestart = () => {
    setShowStartScreen(true);
    setShowResult(false);
    setActiveQuestion(0);
    setQuestions(shuffle(QuizData.questions).slice(0, NUMBER_OF_QUESTIONS));
    setResult({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    });
  };

  /**
   * 問題選択ボタン
   *
   * @param answer
   * @param index
   */
  const onAnswerSelected = (answer: string, index: number) => {
    setSelectedAnswerIndex(index);
    if (answer === correctAnswer) {
      setSelectedAnswer(true);
    } else {
      setSelectedAnswer(false);
    }
  };

  useEffect(() => {
    setQuestion(questions[activeQuestion].question);
    setChoices(questions[activeQuestion].choices);
    setCorrectAnswer(questions[activeQuestion].correctAnswer);
  }, [activeQuestion]);

  useEffect(() => {
    if (showStartScreen) {
      return;
    }
    if (timer <= 0 || showResult) {
      setTimer(0);
      setShowResult(true);
      if (
        isRewardComplete === false &&
        result.score >= PASSING_GRADE
      ) {
        reward();
        setIsRewardComplete(true);
      }
      return;
    }
  }, [showResult, showStartScreen, reward]);

  useEffect(() => {
    const countTimer = setTimeout(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000); // 1秒ごとに実行

    return () => clearTimeout(countTimer);
  }, [timer, setTimer]);

  return (
    <div className="mb-4 mt-8 w-11/12 max-w-3xl md:w-7/12 lg:w-4/12">
      <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
        四柱推命クイズ
      </h1>
      <h2 className="mb-2 text-center text-sm dark:text-white sm:text-base">
        四柱推命に関するクイズを出題します。
      </h2>

      <Card
        className="mt-10 flex flex-col justify-center"
        shadow="md"
        radius="md">
        <CardBody>
          <div className="px-8 py-6">
            {showStartScreen && (
              <div className="flex flex-col justify-center">
                <p className="mb-2 text-lg dark:text-white sm:text-lg">
                  <span className="font-bold">四柱推命</span>
                  に関するクイズを、ランダムに出題します。4択の中から解答を選択し、ボタンを押して次の問題に進みます。合計
                  <span className="font-bold">
                    {questions.length}問
                  </span>
                  、制限時間は<span className="font-bold">10分</span>、
                  合格ラインは<span className="font-bold">80点</span>です。
                </p>
                <p className="mb-2 text-lg dark:text-white">
                  四柱推命を学習中の方も、四柱推命プロ鑑定士の方も、腕試しとしてぜひ挑戦してみてください！
                </p>
                <Button
                  className="mx-auto mt-8 w-1/2"
                  color="primary"
                  size="lg"
                  onClick={onClickStart}>
                  クイズを開始
                </Button>
              </div>
            )}
            {!showStartScreen && !showResult && (
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <span className="text-xl font-normal text-purple-600">
                    第{activeQuestion + 1}問
                  </span>
                  <span className="flex items-end text-lg text-green-600">
                    <ClockIcon className="mr-1 h-6 w-6" />
                    {formatTime(timer)}
                  </span>
                </div>
                <h2 className="text-lg md:text-lg">{question}</h2>
                <ul className="my-8">
                  {choices.map((answer, index) => (
                    <li
                      onClick={() => onAnswerSelected(answer, index)}
                      key={answer}
                      className={
                        selectedAnswerIndex === index
                          ? "mt-4 cursor-pointer list-none rounded-lg border-2 border-sky-500 bg-sky-100 p-3 text-lg no-underline md:text-lg"
                          : "mt-4 cursor-pointer list-none rounded-lg border-1 border-stone-200 p-3 text-lg no-underline md:text-lg"
                      }>
                      {answer}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    size="lg"
                    onClick={onClickNext}
                    isDisabled={selectedAnswerIndex === null}>
                    {activeQuestion === questions.length - 1
                      ? "終了"
                      : "次の問題"}
                  </Button>
                </div>
              </div>
            )}
            {!showStartScreen && showResult && (
              <div className="result flex flex-col items-center text-lg">
                <h3 id="rewardId" className="font-bold">
                  結果
                </h3>
                <p className="my-6">
                  <span className="text-7xl font-normal">
                    {result.score}
                  </span>
                  <span className="text-base font-normal">
                    /100点
                  </span>
                </p>
                <p className="text-lg">
                  {result.score >= PASSING_GRADE
                    ? "おめでとうございます！合格ラインに達しました。四柱推命に関する素晴らしい知識をお持ちですね。"
                    : `お疲れ様でした。合格ラインまであと${PASSING_GRADE - result.score}点です。`}
                  {(PASSING_GRADE - result.score <= 10 && PASSING_GRADE - result.score > 0) &&
                    "もう一息ですね。頑張ってください！"
                  }
                </p>
                <Button
                  className="mt-8 text-base"
                  onClick={onClickRestart}>
                  もう一度挑戦
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Quiz;
