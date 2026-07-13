import { useForm, UseFormSetValue } from "react-hook-form";
import OptionSwitches from "./OptionSwitches";
import { motion, AnimatePresence } from "framer-motion";
import {
  FourPillarsData,
  FourPillarsProps,
  OptionData
} from "@/app/types";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { Shippori_Mincho_B1 } from "next/font/google";
import { StemIcon, BranchIcon } from "ui";
import { Tooltip } from "react-tooltip";

const useFont = false; // フォントを使用する場合はtrue、SVGを使用する場合はfalse

const ship = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-ship"
});

export default function ResultChart({
  result
}: FourPillarsProps): JSX.Element {
  const {
    heavenlyStems,
    earthlyBranches,
    isHourUnknown,
    nickname
  }: FourPillarsData = result;

  const { watch, setValue } = useForm({
    defaultValues: {
      showChangingStars: true,
      showTwelveLucks: true,
      showHiddenStems: true,
      showWithColor: true,
      showRoots: true
    }
  });

  const hourStem = heavenlyStems.find(
    stem => stem.position === "hour"
  );
  const dayStem = heavenlyStems.find(stem => stem.position === "day");
  const monthStem = heavenlyStems.find(
    stem => stem.position === "month"
  );
  const yearStem = heavenlyStems.find(
    stem => stem.position === "year"
  );
  const hourBranch = earthlyBranches.find(
    branch => branch.position === "hour"
  );
  const dayBranch = earthlyBranches.find(
    branch => branch.position === "day"
  );
  const monthBranch = earthlyBranches.find(
    branch => branch.position === "month"
  );
  const yearBranch = earthlyBranches.find(
    branch => branch.position === "year"
  );

  const colors = [
    "bg-emerald-100",
    "bg-red-100",
    "bg-amber-100",
    "bg-slate-100",
    "bg-indigo-100"
  ];
  const plainColor = "bg-gray-200";

  const showChangingStars = watch("showChangingStars");
  const showTwelveLucks = watch("showTwelveLucks");
  const showHiddenStems = watch("showHiddenStems");
  const showWithColor = watch("showWithColor");

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // A Framer Motion bug
  // https://github.com/framer/motion/issues/1850
  // https://github.com/vercel/next.js/issues/49279

  return (
    <>
      <div className="section-container">
        <div className="section-header flex items-center border-b dark:border-b-0">
          <TableCellsIcon className="section-icon" />
          {nickname ? `${nickname}さんの命式` : "命式"}
        </div>
        <div
          className={`grid grid-cols-[1fr_1fr_1fr_1fr_1fr] place-content-center gap-x-1 gap-y-1 bg-white px-4 py-4 text-base text-neutral-600 dark:bg-gray-800 sm:gap-x-1.5 sm:gap-y-1.5 sm:px-10 sm:py-6 md:grid-cols-[0.7fr_1fr_1fr_1fr_1fr] ${ship.variable}`}>
          <div className="bg-transparent"></div>
          <div className="chart-heading">
            <div className="chart-text">時柱</div>
          </div>
          <div className="chart-heading">
            <div className="chart-text">日柱</div>
          </div>
          <div className="chart-heading">
            <div className="chart-text">月柱</div>
          </div>
          <div className="chart-heading">
            <div className="chart-text">年柱</div>
          </div>
          <div className="chart-heading">
            <div className="chart-text">天干</div>
          </div>
          {!isHourUnknown ? (
            <div
              className={`pillar-content ${showWithColor && hourStem!.elementId !== undefined
                ? colors[hourStem!.elementId]
                : plainColor
                } `}
              data-tooltip-id={"hourStemTooltip"}
              data-tooltip-content={`時干：${hourStem?.description}
            性質：${hourStem?.explanation}
            通根：${hourStem?.roots && hourStem?.roots.length > 0
                  ? hourStem?.roots?.join("・")
                  : "なし"
                }`}
              data-tooltip-variant="info">
              {useFont ? (
                <div className="pillar-text">
                  {hourStem && hourStem.value}
                </div>
              ) : (
                <div className="pillar-icon">
                  <StemIcon index={hourStem?.index}></StemIcon>
                </div>
              )}
            </div>
          ) : (
            <div
              className="pillar-content bg-gray-200"
              data-tooltip-id={"hourStemTooltip"}
              data-tooltip-content={"生時不明"}
              data-tooltip-variant="info"></div>
          )}
          <Tooltip
            id="hourStemTooltip"
            className="whitespace-pre-line"
          />
          <div
            className={`pillar-content ${showWithColor && dayStem!.elementId !== undefined
              ? colors[dayStem!.elementId]
              : plainColor
              }`}
            data-tooltip-id={"dayStemTooltip"}
            data-tooltip-content={`日干：${dayStem?.description}
          性質：${dayStem?.explanation}
          通根：${dayStem?.roots && dayStem?.roots.length > 0
                ? dayStem?.roots?.join("・")
                : "なし"
              }`}
            data-tooltip-variant="info">
            {useFont ? (
              <div className="pillar-text">{dayStem!.value}</div>
            ) : (
              <div className="pillar-icon">
                <StemIcon index={dayStem?.index}></StemIcon>
              </div>
            )}
          </div>
          <Tooltip
            id="dayStemTooltip"
            className="whitespace-pre-line"
          />
          <div
            className={`pillar-content ${showWithColor && monthStem!.elementId !== undefined
              ? colors[monthStem!.elementId]
              : plainColor
              }`}
            data-tooltip-id={"monthStemTooltip"}
            data-tooltip-content={`月干：${monthStem?.description}
          性質：${monthStem?.explanation}
          通根：${monthStem?.roots && monthStem?.roots.length > 0
                ? monthStem?.roots?.join("・")
                : "なし"
              }`}
            data-tooltip-variant="info">
            {useFont ? (
              <div className="pillar-text">{monthStem!.value}</div>
            ) : (
              <div className="pillar-icon">
                <StemIcon index={monthStem?.index}></StemIcon>
              </div>
            )}
          </div>
          <Tooltip
            id="monthStemTooltip"
            className="whitespace-pre-line"
          />
          <div
            className={`pillar-content ${showWithColor && yearStem!.elementId !== undefined
              ? colors[yearStem!.elementId]
              : plainColor
              }`}
            data-tooltip-id={"yearStemTooltip"}
            data-tooltip-content={`年干：${yearStem?.description}
          性質：${yearStem?.explanation}
          通根：${yearStem?.roots && yearStem?.roots.length > 0
                ? yearStem?.roots?.join("・")
                : "なし"
              }`}
            data-tooltip-variant="info">
            {useFont ? (
              <div className="pillar-text">{yearStem!.value}</div>
            ) : (
              <div className="pillar-icon">
                <StemIcon index={yearStem?.index}></StemIcon>
              </div>
            )}
          </div>
          <Tooltip
            id="yearStemTooltip"
            className="whitespace-pre-line"
          />
          {showChangingStars && (
            <>
              <AnimatePresence>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  key="test"
                // animate={{
                //   scale: [0.5, 1.1, 1.1, 1, 1],
                //   borderRadius: ['20%', '20%', '50%', '50%', '20%']
                // }}
                >
                  <div className="chart-heading">
                    <div className="chart-text">通変星</div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {!isHourUnknown ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="pillar-sub-content">
                  <div className="chart-text">
                    {hourStem && hourStem.changingStar}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="pillar-sub-content"></motion.div>
              )}
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {dayStem!.changingStar}
                </div>
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {monthStem!.changingStar}
                </div>
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {yearStem!.changingStar}
                </div>
              </motion.div>
            </>
          )}
          {showTwelveLucks && (
            <>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="chart-heading">
                <div className="chart-text">十二運</div>
              </motion.div>
              {!isHourUnknown ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="pillar-sub-content">
                  <div className="chart-text">
                    {hourStem && hourStem.twelveLuck}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="pillar-sub-content"></motion.div>
              )}
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {dayStem!.twelveLuck}
                </div>
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {monthStem!.twelveLuck}
                </div>
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {yearStem!.twelveLuck}
                </div>
              </motion.div>
            </>
          )}
          <div className="chart-heading">
            <div className="chart-text">地支</div>
          </div>
          {!isHourUnknown ? (
            <div
              className={`pillar-content ${showWithColor && hourBranch!.elementId !== undefined
                ? colors[hourBranch!.elementId]
                : plainColor
                }`}
              data-tooltip-id={"hourBranchTooltip"}
              data-tooltip-content={`時支：${hourBranch?.description}
            性質：${hourBranch?.explanation}`}
              data-tooltip-variant="info">
              {useFont ? (
                <div className="pillar-text">
                  {hourBranch && hourBranch.value}
                </div>
              ) : (
                <div className="pillar-icon">
                  <BranchIcon index={hourBranch?.index}></BranchIcon>
                </div>
              )}
            </div>
          ) : (
            <div
              className="pillar-content bg-gray-200"
              data-tooltip-id={"hourBranchTooltip"}
              data-tooltip-content={"生時不明"}
              data-tooltip-variant="info"></div>
          )}
          <Tooltip
            id="hourBranchTooltip"
            className="whitespace-pre-line"
          />
          <div
            className={`pillar-content ${showWithColor && dayBranch!.elementId !== undefined
              ? colors[dayBranch!.elementId]
              : plainColor
              }`}
            data-tooltip-id={"dayBranchTooltip"}
            data-tooltip-content={`日支：${dayBranch?.description}
          性質：${dayBranch?.explanation}`}
            data-tooltip-variant="info">
            {useFont ? (
              <div className="pillar-text">{dayBranch!.value}</div>
            ) : (
              <div className="pillar-icon">
                <BranchIcon index={dayBranch?.index}></BranchIcon>
              </div>
            )}
          </div>
          <Tooltip
            id="dayBranchTooltip"
            className="whitespace-pre-line"
          />
          <div
            className={`pillar-content ${showWithColor && monthBranch!.elementId !== undefined
              ? colors[monthBranch!.elementId]
              : plainColor
              }`}
            data-tooltip-id={"monthBranchTooltip"}
            data-tooltip-content={`月支：${monthBranch?.description}
          性質：${monthBranch?.explanation}`}
            data-tooltip-variant="info">
            {useFont ? (
              <div className="pillar-text">{monthBranch!.value}</div>
            ) : (
              <div className="pillar-icon">
                <BranchIcon index={monthBranch?.index}></BranchIcon>
              </div>
            )}
          </div>
          <Tooltip
            id="monthBranchTooltip"
            className="whitespace-pre-line"
          />
          <div
            className={`pillar-content ${showWithColor && yearBranch!.elementId !== undefined
              ? colors[yearBranch!.elementId]
              : plainColor
              }`}
            data-tooltip-id={"yearBranchTooltip"}
            data-tooltip-content={`年支：${yearBranch?.description}
          性質：${yearBranch?.explanation}`}
            data-tooltip-variant="info">
            {useFont ? (
              <div className="pillar-text">{yearBranch!.value}</div>
            ) : (
              <div className="pillar-icon">
                <BranchIcon index={yearBranch?.index}></BranchIcon>
              </div>
            )}
          </div>
          <Tooltip
            id="yearBranchTooltip"
            className="whitespace-pre-line"
          />
          {showHiddenStems && (
            <>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="chart-heading">
                <div className="chart-text">蔵干</div>
              </motion.div>
              {!isHourUnknown ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="pillar-sub-content">
                  <div className="chart-text">
                    {hourBranch &&
                      hourBranch!.hiddenStems!.map(
                        (stem, i: number) => (
                          <span key={i}>
                            {stem.value} <br />
                          </span>
                        )
                      )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="pillar-sub-content"></motion.div>
              )}
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {dayBranch &&
                    dayBranch!.hiddenStems!.map((stem, i: number) => (
                      <span key={i}>
                        {stem.value} <br />
                      </span>
                    ))}
                </div>
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {monthBranch &&
                    monthBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span key={i}>
                          {stem.value} <br />
                        </span>
                      )
                    )}
                </div>
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {yearBranch &&
                    yearBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span key={i}>
                          {stem.value} <br />
                        </span>
                      )
                    )}
                </div>
              </motion.div>
            </>
          )}
          {showChangingStars && (
            <>
              <div className="chart-heading">
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="chart-text">
                  通変星
                </motion.div>
              </div>
              {!isHourUnknown ? (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="pillar-sub-content">
                  <div className="chart-text">
                    {hourBranch &&
                      hourBranch!.hiddenStems!.map(
                        (stem, i: number) => (
                          <span key={i}>
                            {stem.changingStar} <br />
                          </span>
                        )
                      )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeInOut}
                  transition={{ duration: 1.0 }}
                  className="pillar-sub-content"></motion.div>
              )}
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {dayBranch &&
                    dayBranch!.hiddenStems!.map((stem, i: number) => (
                      <span key={i}>
                        {stem.changingStar} <br />
                      </span>
                    ))}
                </div>
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {monthBranch &&
                    monthBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span key={i}>
                          {stem.changingStar} <br />
                        </span>
                      )
                    )}
                </div>
              </motion.div>
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
                transition={{ duration: 1.0 }}
                className="pillar-sub-content">
                <div className="chart-text">
                  {yearBranch &&
                    yearBranch!.hiddenStems!.map(
                      (stem, i: number) => (
                        <span key={i}>
                          {stem.changingStar} <br />
                        </span>
                      )
                    )}
                </div>
              </motion.div>
            </>
          )}
          <div className="flex items-center justify-center">
            <OptionSwitches
              result={result}
              setValue={setValue}></OptionSwitches>
          </div>
        </div>
      </div>
    </>
  );
}

// Tailwind CSS responsive square divs
// https://dev.to/dailydevtips1/tailwind-css-responsive-square-divs-dof

// Revisiting Tailwind square divs with aspect ratio
// https://dev.to/dailydevtips1/revisiting-tailwind-square-divs-with-aspect-ratio-3pd5
