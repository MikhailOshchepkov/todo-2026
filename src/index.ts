import buildApp from "./app";

const PORT = parseInt (process.env.PORT ?? "3000");
const app = buildApp();

app.listen(PORT, ()=>  {
    console.log(`Server started on port ${PORT}`);
});