export async function newFile(path: string, name: string) {
  try {
    const res = await fetch(`http://localhost:8081/projects/test_proj/file`, {
      method: "POST",
      body: JSON.stringify({ path: `${path}/test.md` }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
}
