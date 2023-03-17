import { BaseSource, Item } from "https://deno.land/x/ddu_vim@v2.4.0/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v2.4.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.3.2/file.ts";
import { ensureArray, isString, } from "https://deno.land/x/unknownutil@v2.1.0/mod.ts";

type Params = { kind: string; };

export class Source extends BaseSource<Params> {

    kind = "file";

    gather(args: {

        denops: Denops;
        sourceParams: Params;

    }): ReadableStream<Item<ActionData>[]> {

            return new ReadableStream({

                async start(controller) {

                    const dir = await fn.getcwd(args.denops) as string;
                    const result = await args.denops.call(`mr#mrw#list`);

                    ensureArray(result, isString);

                    controller.enqueue(result.map((p) => ({

                        word: p,
                        action: { path: p, },

                    })));
                    
                    controller.close();

                },

            });

      }

    params(): Params {

        return { kind: "mrw" };

    }

}
