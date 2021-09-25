/* programs/amplify/src/lib.rs */
use anchor_lang::prelude::*;

declare_id!("5xJX49gW56EWkQJeBELE74TsQeNogtuR3DyHJGF69SoC");

#[program]
mod amplify {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, image: String, categories: String, min_rating: u32) -> ProgramResult {
        let request_account = &mut ctx.accounts.request;
        request_account.requester = *ctx.accounts.requester.unsigned_key();
        request_account.image = image;
        request_account.categories = categories;
        request_account.min_rating = min_rating;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = requester, space = 64 + 64 + 64)]
    pub request: Account<'info, RequestAccount>,
    #[account(mut)]
    pub requester: Signer<'info>,
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