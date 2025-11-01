// Local ambient declarations to help the TS language server while working with JS files
declare module "jsonwebtoken";

// Allow importing the local user model (JS file) without TS complaints
declare module "../models/userModel.js" {
  const value: any;
  export default value;
}

// If process is not recognized in the editor, provide a minimal declaration
declare var process: {
  env: { [key: string]: string | undefined };
};

// Augment Express Request type so `req.user` is allowed in middleware
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
