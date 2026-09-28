/* Teste de fumaça do app e da regra de atualização do feed */
import "react-native";
import { upsert } from "../src/pages/Feed";

it("upsert substitui o post curtido e mantém os demais", () => {
  const feed = [{ _id: "a", likes: 0 }, { _id: "b", likes: 0 }];
  expect(upsert(feed, { _id: "a", likes: 1 })).toEqual([{ _id: "a", likes: 1 }, { _id: "b", likes: 0 }]);
  expect(upsert(feed, { _id: "c", likes: 0 })[0]._id).toBe("c");
});
/* Fim de App-test.js */
