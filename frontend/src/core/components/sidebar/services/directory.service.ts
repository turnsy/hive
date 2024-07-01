export function getProjectDirectory(project_uuid: string) {
  fetch(`localhost:8080/filetree/${project_uuid}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}

export function getPathFromId(node_id: number, tree: any) {
    const res = [];
    let cur_node = tree[node_id];
    while (cur_node.name != '') {
        res.push(cur_node.name);
        cur_node = tree[cur_node.parent];
    }
   return res.reverse().join("/")
}