/* programs/amplify/src/lib.rs */
use anchor_lang::prelude::*;

declare_id!("2FStxUMjeoPugj3oEYkmqyDMB9UyShhe1uBzHWTFpLdA");

#[program]
mod amplify {
    use super::*;

    pub fn request(ctx: Context<Request>, image: String, categories: String, min_rating: u32) -> ProgramResult {
        let request_account = &mut ctx.accounts.request;
        request_account.requester = *ctx.accounts.requester.unsigned_key();
        request_account.image = image;
        request_account.categories = categories;
        request_account.min_rating = min_rating;
        Ok(())
    }

    pub fn label(ctx: Context<Label>, label: String) -> ProgramResult {
        let request_account = &mut ctx.accounts.request;
        request_account.label = Some(label);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Request<'info> {
    #[account(init, payer = requester, space = 1000)]
    pub request: Account<'info, RequestAccount>,
    #[account(mut)]
    pub requester: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Label<'info> {
    #[account(mut)]
    pub request: Account<'info, RequestAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct RequestAccount {
    pub requester: Pubkey,
    pub image: String,
    pub categories: String,
    pub min_rating: u32,
    pub label: Option<String>,
}