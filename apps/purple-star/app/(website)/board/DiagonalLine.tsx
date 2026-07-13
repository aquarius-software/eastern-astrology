export default function DiagonalLine({ palacePosition }: { palacePosition: number }) {
  const stroke = "rgb(94 234 212)"; // teal-300
  const strokeWidth = "0.07";
  const strokeOpacity = "0.7";
  const strokeDashArray = "0.1";

  return (
    <>
      {
        (palacePosition === 0 || palacePosition === 11) &&
        <line
          x1="0"
          y1="0"
          x2="10"
          y2="10"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          strokeDasharray={strokeDashArray}
        />
      }
      {
        (palacePosition === 3 || palacePosition === 8) &&
        <line
          x1="10"
          y1="0"
          x2="0"
          y2="10"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          strokeDasharray={strokeDashArray}
        />
      }
      {
        (palacePosition === 1 || palacePosition === 10) &&
        <line
          x1="2.5"
          y1="0"
          x2="7.5"
          y2="10"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          strokeDasharray={strokeDashArray}
        />
      }
      {
        (palacePosition === 2 || palacePosition === 9) &&
        <line
          x1="7.5"
          y1="0"
          x2="2.5"
          y2="10"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          strokeDasharray={strokeDashArray}
        />
      }
      {
        (palacePosition === 4 || palacePosition === 7) &&
        <line
          x1="0"
          y1="2.5"
          x2="10"
          y2="7.5"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          strokeDasharray={strokeDashArray}
        />
      }
      {
        (palacePosition === 5 || palacePosition === 6) &&
        <line
          x1="0"
          y1="7.5"
          x2="10"
          y2="2.5"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          strokeDasharray={strokeDashArray}
        />
      }
    </>
  )
}
