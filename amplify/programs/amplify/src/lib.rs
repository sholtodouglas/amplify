/* programs/amplify/src/lib.rs */
use anchor_lang::prelude::*;

declare_id!("7BFUYjtQA6wXd4WgGGFrDiZ8r2iXNSnDPKT8J2ZHs7Dw");

#[program]
mod amplify {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, image: String, categories: String, min_rating: String) -> ProgramResult {
        let request_account = &mut ctx.accounts.request;
        request_account.requester = *ctx.accounts.requester.unsigned_key();
        request_account.image = image;
        request_account.categories = categories;
        request_account.min_rating = min_rating;
        Ok(())
    }

    pub fn register(ctx: Context<Register>) -> ProgramResult {
        let labeller_account = &mut ctx.accounts.labeller;
        labeller_account.rating = String::from("1");
        labeller_account.beneficiary = *ctx.accounts.beneficiary.unsigned_key();
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

#[derive(Accounts)]
pub struct Register<'info> {
    #[account(init, payer = labeller, space = 64 + 64 + 64)]
    pub labeller: Account<'info, LabellerAccount>,
    #[account(mut)]
    pub beneficiary: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct RequestAccount {
    pub data: String,
    pub requester: Pubkey,
    pub image: String,
    pub categories: String,
    pub min_rating: String,
}

#[account]
pub struct LabellerAccount {
    pub beneficiary: Pubkey, // Account which recieves sol rewards for this labeller.
    pub rating: String,
}