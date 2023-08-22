
import * as d3 from 'd3'
import { useParams } from "react-router-dom";
import {useLocation} from "react-router-dom";
import {Link} from "react-router-dom";
const TestGraph = (nodeArray, linkArray) =>{
    const nodes = useLocation().state.nodeArray
    const links = useLocation().state.linkArray
    const data = {
           nodes: JSON.parse(nodes),
           links: JSON.parse(links)
    }
    return (
       <div></div>
    );
}
export default TestGraph;