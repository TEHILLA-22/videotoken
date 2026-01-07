use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};

declare_id!("VidTok1111111111111111111111111111111111");

const CREATE_FEE_LAMPORTS: u64 = 2_000_000;

#[program]
pub mod videotoken {
    use super::*;

    pub fn create_videotoken(
        ctx: Context<CreateVideoToken>,
        name: String,
        symbol: String,
        logo: String,
        twitter: String,
        website: String,
        telegram: String,
        initial_supply: u64,
    ) -> Result<()> {

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.creator.key(),
            &ctx.accounts.treasury.key(),
            CREATE_FEE_LAMPORTS,
        );

        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
            ],
        )?;

        let meta = &mut ctx.accounts.metadata;
        meta.creator = ctx.accounts.creator.key();
        meta.mint = ctx.accounts.mint.key();
        meta.name = name;
        meta.symbol = symbol;
        meta.logo = logo;
        meta.twitter = twitter;
        meta.website = website;
        meta.telegram = telegram;
        meta.created_at = Clock::get()?.unix_timestamp;

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.creator_token_account.to_account_info(),
            authority: ctx.accounts.creator.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
        );

        token::mint_to(cpi_ctx, initial_supply)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateVideoToken<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(mut)]
    pub treasury: SystemAccount<'info>,

    #[account(
        init,
        payer = creator,
        mint::decimals = 9,
        mint::authority = creator,
        mint::freeze_authority = creator
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = creator
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = creator,
        space = VideoTokenMetadata::SPACE,
        seeds = [b"metadata", mint.key().as_ref()],
        bump
    )]
    pub metadata: Account<'info, VideoTokenMetadata>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct VideoTokenMetadata {
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub logo: String,
    pub twitter: String,
    pub website: String,
    pub telegram: String,
    pub created_at: i64,
}

impl VideoTokenMetadata {
    pub const SPACE: usize =
        8 +
        32 +
        32 +
        4 + 64 +
        4 + 16 +
        4 + 128 +
        4 + 64 +
        4 + 64 +
        4 + 64 +
        8;
}
