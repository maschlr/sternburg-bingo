# -*- coding: utf-8 -*-
from flask import Flask, redirect, url_for, render_template
from app import app, db, login_user, logout_user, current_user
from app.oauth import OAuthSignIn
from .models import User, Cap
import random

@app.route('/')
@app.route('/index')
def index():
    user = {'nickname': 'Marten'}
    caps = [{'number': number,
             'count': count} for number, count in zip(range(1,100), (random.randint(0,5) for i in range(99)))]
    return render_template('index.html',
                           title='Home',
                           user=user,
                           caps=caps)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


@app.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, email = oauth.callback()
    if social_id is None:
        flash('Authentication failed.')
        return redirect(url_for('index'))
    user = User.query.filter_by(social_id=social_id).first()
    if not user:
        user = User(social_id=social_id, nickname=username, email=email)
        db.session.add(user)
        db.session.commit()
    login_user(user, True)
    return redirect(url_for('index'))
