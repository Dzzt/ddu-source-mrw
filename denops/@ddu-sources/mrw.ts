import { BaseSource, Item } from "https://deno.land/x/ddu_vim@v2.0.0/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v2.0.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.3.2/file.ts";
import {
    ensureArray,
    isString,
} from "https://deno.land/x/unknownutil@v1.1.4/mod.ts";
import { relative } from "https://deno.land/std@0.122.0/path/mod.ts#^";

type Params = {
    kind: string;
    current: boolean;
};

export class Source extends BaseSource<Params> {
    kind = "file";

    gather(args: {
        denops: Denops;
        sourceParams: Params;
    }): ReadableStream<Item<ActionData>[]> {
        return new ReadableStream({

            async start(controller) {

            const dir = await fn.getcwd(args.denops) as string;

            const result = args.sourceParams.current
                ? await args.denops.call(
                    "mr#filter",
                    await args.denops.call(`mr#mrw#list`),
                    `${dir}`,
                  )
                : await args.denops.call(`mr#mrw#list`);

            ensureArray(result, isString);

            controller.enqueue(result.map((p) => ({
                word: args.sourceParams.current ? relative(dir, p) : p,
                action: {
                    path: p,
              },
            })));

            controller.close();

            },
        });
      }

    params(): Params {
        return {
            kind: "mrw",
            current: false,
            };
    }

}
