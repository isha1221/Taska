import { Request, Response, NextFunction } from "express";
import { bold, red, yellow, green } from "kleur";

export const logMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;
    const ip = req.ip;
    let statusColor;

    if (status >= 500) {
      statusColor = red(status.toString());
    } else if (status >= 400) {
      statusColor = yellow(status.toString());
    } else if (status >= 200) {
      statusColor = green(status.toString());
    } else {
      statusColor = status.toString();
    }

    console.log(
      `${bold(
        new Date().toISOString()
      )} ${method} ${url} ${statusColor} ${ip} - ${elapsedMs.toFixed(3)} ms`
    );
  });
  next();
};
