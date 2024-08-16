export async function newEntry(
  path: string,
  projectId: string,
  isFile: boolean
) {
  const fullPath = isFile ? path + ".md" : path;
  try {
    const res = await fetch(`http://localhost:8081/projects/${projectId}`, {
      method: "POST",
      body: JSON.stringify({
        path: fullPath,
        isFile: isFile,
      }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
}
