import React from "react";
import Table from "components/table/";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  verticalSpanTreeData,
  colspanOnlyTreeData,
  simpleTreeData,
} from "mocks/tree.module";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Table
              nodesList={verticalSpanTreeData.nodes}
              leavesAmount={verticalSpanTreeData.leavesAmount}
            />
          </Route>
          <Route path="/1">
            <Table
              nodesList={colspanOnlyTreeData.nodes}
              leavesAmount={colspanOnlyTreeData.leavesAmount}
            />
          </Route>
          <Route path="/2">
            <Table
              nodesList={simpleTreeData.nodes}
              leavesAmount={simpleTreeData.leavesAmount}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
