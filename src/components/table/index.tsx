import React, { Component } from "react";
import "./index.scss";
import { TableCell, MockType, TableCellMock, TreeNode, MockInfo } from "types";

interface TableProps {
  nodesList: TreeNode[];
  leavesAmount: number;
}

interface TableState {
  table: any;
  columnsAmount: number;
  tableEntities: any;
}

export class Table extends Component<TableProps, TableState> {
  state = {
    table: [],
    columnsAmount: 0,
    tableEntities: {},
  };

  normalizeTreeData = (nodes, leavesAmount) => {
    let cellsLeftInRow = leavesAmount;
    let currentRow: any[] = [];
    let tableEntities = {};
    let table: any[] = [];
    let mocks: MockInfo[] = [];

    //creating rows from flat list
    nodes.forEach((cell) => {
      //creating cell
      const newCell = new TableCell(
        cell.value,
        cell.color,
        cell.verticalSpan,
        cell.width,
        cell.id
      );

      //saving rowspan mocks positions and width for next rows
      const rowIndex = table.length;
      if (cell.verticalSpan > 1) {
        let i = 0;
        while (i < cell.verticalSpan - 1) {
          mocks.push(
            new MockInfo(
              cell.width,
              currentRow.length,
              rowIndex + i + 1,
              cell.id
            )
          );
          ++i;
        }
      }

      //checking if we have some mocks for this row
      const rowSpansForCurrentIndex = mocks.filter(
        (mockInfo) =>
          mockInfo.rowIndex === rowIndex &&
          mockInfo.colIndex === currentRow.length
      );

      //if index is bigger than cells in row
      const rowSpansForRowEnd = mocks.filter(
        (mockInfo) =>
          mockInfo.rowIndex === rowIndex &&
          cellsLeftInRow - cell.width === 0 &&
          mockInfo.colIndex + 1 > currentRow.length + cell.width
      );

      const createMockFromMockInfo = (mockInfo) => {
        let i = 0;
        while (i < mockInfo.width) {
          const newColMock =
            i === 0
              ? new TableCellMock(MockType.rowSpan, mockInfo.parentId)
              : new TableCellMock(MockType.colSpan, mockInfo.parentId);
          currentRow.push(newColMock.id);
          tableEntities = {
            ...tableEntities,
            [newColMock.id]: newColMock,
          };
          ++i;
        }
      };

      if (rowSpansForCurrentIndex.length > 0) {
        //creating and pushing rowspan mocks
        rowSpansForCurrentIndex.forEach((mockInfo) => {
          createMockFromMockInfo(mockInfo);
        });
      }

      currentRow.push(newCell.id);
      tableEntities = {
        ...tableEntities,
        [newCell.id]: newCell,
      };

      if (rowSpansForRowEnd.length > 0) {
        //creating and pushing rowspan mocks to the end of the line
        rowSpansForRowEnd.forEach((mockInfo) => {
          createMockFromMockInfo(mockInfo);
        });
      }

      if (cell.width > 1) {
        //creating and pushing colspan mocks
        let i = 0;
        while (i < cell.width - 1) {
          const newColMock = new TableCellMock(MockType.colSpan, cell.id);
          currentRow.push(newColMock.id);
          tableEntities = {
            ...tableEntities,
            [newColMock.id]: newColMock,
          };
          ++i;
        }
      }
      cellsLeftInRow -= cell.width;

      if (cellsLeftInRow <= 0) {
        //preparing for next iteration
        const rowspans = mocks.reduce(
          (rowspanWidth: number, mockInfo: MockInfo, index: number) => {
            if (mockInfo.rowIndex === rowIndex + 1) {
              return (rowspanWidth += mockInfo.width);
            } else return rowspanWidth;
          },
          0
        );
        //next row length minus rowspans
        cellsLeftInRow = leavesAmount - rowspans;
        //saving current row
        table.push(currentRow);
        currentRow = [];
      }
    });
    return { table, tableEntities };
  };

  componentDidMount() {
    const { nodesList, leavesAmount } = this.props;
    const normalizedTableData = this.normalizeTreeData(nodesList, leavesAmount);
    const table = normalizedTableData.table;
    const tableEntities = normalizedTableData.tableEntities;
    this.setState({ columnsAmount: leavesAmount, table, tableEntities });
  }

  addColumn = (columnIndex) => {
    const { tableEntities, table, columnsAmount } = this.state;
    const newColumnsAmount = columnsAmount + 1;
    let newTableEntities = { ...tableEntities };
    let newRowSpanCellId = "";
    let cellExpandedById = "";
    const newTable = table.map((row: string[], rowIndex) => {
      return row.reduce((row: string[], id, cellIndex) => {
        if (cellIndex === columnIndex) {
          const cell = tableEntities[id];
          if (!(cell instanceof TableCellMock)) {
            if (cell.width === 1) {
              //creating cell clone
              const newCell = new TableCell(
                cell.value,
                cell.color,
                cell.verticalSpan,
                cell.width
              );
              if (newCell.verticalSpan > 1) {
                newRowSpanCellId = newCell.id;
              }
              newTableEntities = {
                ...newTableEntities,
                [newCell.id]: newCell,
              };
              return [...row, id, newCell.id];
            } else {
              //expanding cell
              const newColMock = new TableCellMock(MockType.colSpan, cell.id);
              if (cell.verticalSpan > 1) {
                newRowSpanCellId = cell.id;
              }
              newTableEntities = {
                ...newTableEntities,
                [cell.id]: {
                  ...newTableEntities[cell.id],
                  width: newTableEntities[cell.id].width + 1,
                },
                [newColMock.id]: newColMock,
              };
              return [...row, cell.id, newColMock.id];
            }
          } else {
            //is mock
            const parentCellId = cell.parentId;
            const type = cell.type;
            if (type === MockType.colSpan) {
              //if colspan - we are changing parent cell and adding new mock
              const newColMock = new TableCellMock(
                MockType.colSpan,
                parentCellId
              );
              newTableEntities = {
                ...newTableEntities,
                [parentCellId]: {
                  ...newTableEntities[parentCellId],
                  width:
                    cellExpandedById === parentCellId
                      ? newTableEntities[parentCellId].width
                      : newTableEntities[parentCellId].width + 1,
                },
                [newColMock.id]: newColMock,
              };
              //saving for rowspan width > 1
              cellExpandedById = parentCellId;

              return [...row, cell.id, newColMock.id];
            } else {
              //if it rowspan mock we are gowing to parent for new mock type
              const parentCell = newTableEntities[newRowSpanCellId];
              //and creating it
              const newColMock = new TableCellMock(
                parentCell.width > 1 ? MockType.colSpan : MockType.rowSpan,
                newRowSpanCellId
              );
              newTableEntities = {
                ...newTableEntities,
                [newColMock.id]: newColMock,
              };
              return [...row, cell.id, newColMock.id];
            }
          }
        }
        return [...row, id];
      }, []);
    });

    this.setState({
      table: newTable,
      tableEntities: newTableEntities,
      columnsAmount: newColumnsAmount,
    });
  };

  addRow = (rowIndex, currentRow: string[]) => {
    const { tableEntities, table } = this.state;

    let newTableEntities = {
      ...tableEntities,
    };
    const newTable: any[] = [...table];
    let currentMockParentId = "";

    const rowClone = currentRow.reduce(
      (row: any, cellId: string, index: number) => {
        const cell = tableEntities[cellId];
        if (cell instanceof TableCellMock) {
          if (cell.type === MockType.rowSpan) {
            //dublicating rowspan mock
            const newColMock = new TableCellMock(
              MockType.rowSpan,
              cell.parentId
            );
            newTableEntities = {
              ...newTableEntities,
              [cell.parentId]: {
                ...newTableEntities[cell.parentId],
                verticalSpan: newTableEntities[cell.parentId].verticalSpan + 1,
              },
              [newColMock.id]: newColMock,
            };
            currentMockParentId = cell.parentId;
            return [...row, newColMock.id];
          } else {
            //dublicating colspan mock
            const newColMock = new TableCellMock(
              MockType.colSpan,
              currentMockParentId
            );
            newTableEntities = {
              ...newTableEntities,
              [newColMock.id]: newColMock,
            };
            return [...row, newColMock.id];
          }
        } else {
          if (cell.verticalSpan === 1) {
            //dublicating cell
            const newCell = new TableCell(
              cell.value,
              cell.color,
              cell.verticalSpan,
              cell.width
            );
            newTableEntities = {
              ...newTableEntities,
              [newCell.id]: newCell,
            };
            currentMockParentId = newCell.id;
            return [...row, newCell.id];
          } else {
            //if rowspan > 1 expand to the bottom
            const newColMock = new TableCellMock(MockType.rowSpan, cell.id);
            newTableEntities = {
              ...newTableEntities,
              [cell.id]: {
                ...newTableEntities[cell.id],
                verticalSpan: newTableEntities[cell.id].verticalSpan + 1,
              },
              [newColMock.id]: newColMock,
            };
            currentMockParentId = cell.id;
            return [...row, newColMock.id];
          }
        }
      },
      []
    );

    newTable.splice(rowIndex + 1, 0, rowClone);

    this.setState({
      table: newTable,
      tableEntities: newTableEntities,
    });
  };

  render() {
    const { table, tableEntities, columnsAmount } = this.state;
    return (
      <table cellPadding="0" cellSpacing="2">
        <tbody>
          <tr>
            <th></th>
            {[...Array(columnsAmount)].map((cell, columnIndex) => (
              <th
                key={`${columnIndex}_th`}
                className="tableHeader"
                onClick={() => {
                  this.addColumn(columnIndex);
                }}
              ></th>
            ))}
          </tr>
          {table.map((row: any[], index: number) => {
            return (
              <tr key={`row_${index}`}>
                <td
                  className="tableCell first"
                  onClick={() => {
                    this.addRow(index, row);
                  }}
                ></td>
                {row.map((cellId) => {
                  const cell = tableEntities[cellId];
                  const cellStyle = {
                    backgroundColor: cell.color,
                  };
                  return (
                    <React.Fragment key={cell.id}>
                      {!(cell instanceof TableCellMock) && (
                        <td
                          className="tableCell"
                          colSpan={cell.width ? cell.width : 1}
                          rowSpan={cell.verticalSpan ? cell.verticalSpan : 1}
                        >
                          <div className="cellContent" style={cellStyle}>
                            {cell.value}
                          </div>
                        </td>
                      )}
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
export default Table;
