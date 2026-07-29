const TablePreview = ({ table }) => {
  if (!table) {
    return <p>Table: Add Values</p>;
  }
  const [head, ...rows] = table?.rows;
  return (
    <table width="100%">
      {head.cells.filter(Boolean).length > 0 && (
        <thead>
          <tr>
            {/* セルの中身は空文字や重複がありうるため、key には位置を使う */}
            {head.cells.map((cell, cellIndex) => (
              <th style={{ textAlign: "left" }} key={cellIndex}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => {
              return <td key={cellIndex}>{cell}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablePreview;
