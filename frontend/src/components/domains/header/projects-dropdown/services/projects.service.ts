export const createProject = async (projectName: string, db: any) => {
  return createProjectEntry(projectName, db.authStore.model?.id, db)
    .then(createProjectDirectory)
    .catch((err) => console.log(err));
};

const createProjectEntry = async (
  name: string,
  user: string,
  db: any
): Promise<any> => {
  return await db.collection("projects").create({
    name,
    user,
  });
};

const createProjectDirectory = async (db_res: any): Promise<any> => {
  const res = await fetch(`http://localhost:8081/projects`, {
    method: "POST",
    body: JSON.stringify({ db_id: db_res.id }),
  });
  return await res.json();
};
