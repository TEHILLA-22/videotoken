use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("VidTokTrade11111111111111111111111111111");

#[program]
pub mod videotoken_trade {
    use super::*;

    pub fn place_market_buy(
        ctx: Context<MarketBuy>,
        lamports: u64,
    ) -> Result<()> {

        let tokens_out = lamports / ctx.accounts.market.price;

        **ctx.accounts.buyer.to_account_info().try_borrow_mut_lamports()? -= lamports;
        **ctx.accounts.vault_sol.try_borrow_mut_lamports()? += lamports;

        let cpi = Transfer {
            from: ctx.accounts.vault_token.to_account_info(),
            to: ctx.accounts.buyer_token.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };

        let seeds = &[b"vault", &[ctx.accounts.market.bump]];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi,
                signer,
            ),
            tokens_out,
        )?;

        Ok(())
    }

    pub fn place_market_sell(
        ctx: Context<MarketSell>,
        token_amount: u64,
    ) -> Result<()> {

        let lamports_out = token_amount * ctx.accounts.market.price;

        let cpi = Transfer {
            from: ctx.accounts.seller_token.to_account_info(),
            to: ctx.accounts.vault_token.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };

        token::transfer(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi),
            token_amount,
        )?;

        **ctx.accounts.vault_sol.try_borrow_mut_lamports()? -= lamports_out;
        **ctx.accounts.seller.to_account_info().try_borrow_mut_lamports()? += lamports_out;

        Ok(())
    }

    pub fn place_limit_order(
        ctx: Context<LimitOrder>,
        is_buy: bool,
        amount: u64,
        price: u64,
    ) -> Result<()> {

        let order = &mut ctx.accounts.order;
        order.owner = ctx.accounts.user.key();
        order.is_buy = is_buy;
        order.amount = amount;
        order.price = price;
        order.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }
}
