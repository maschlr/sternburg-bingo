# -*- coding: utf-8 -*-
from flask import redirect, url_for, render_template, request, g, flash, session, jsonify, abort
from flask.ext.login import login_user, logout_user, current_user, login_required
from app import app, db, lm
from app.oauth import OAuthSignIn
from .models import User, Cap
import pdb

@app.route('/')
#@app.route('/index')
def index():
    user = g.user
    if user.is_authenticated:
        caps = user.caps.all()
        rows = []
        for i in range(16):
            rows.append(caps[i*6:(i+1)*6])
        rows.append(caps[8*12:])
        return render_template('index.html',
                               title='Home',
                               user=user,
                               caps=caps,
                               rows=rows)
    else:
        return render_template('index.html')


@app.route('/bingo')
@login_required
def bingo():
    return render_template('bingo.html')


@app.route('/caps')
@login_required
def get_caps():
    user = g.user
    caps = user.caps.all()
    return jsonify({"caps": [{"number": cap.number,
                              "count": cap.count} for cap in caps]})


@app.route('/caps/add/<int:number>', methods=["PUT"])
@login_required
def add(number):
    if (number < 1 or number > 99):
        abort(400)
    else:
        user = g.user
        cap = user.caps.filter_by(number=number).first()
        cap.count += 1
        db.session.add(cap)
        db.session.commit()
        return jsonify({"nickname": user.nickname, "number": cap.number, "count": cap.count})


@app.route('/caps/remove/<int:number>', methods=["PUT"])
@login_required
def remove(number):
    if (number < 1 or number > 99):
        abort(400)
    else:
        user = g.user
        cap = user.caps.filter_by(number=number).first()
        if cap.count > 0:
            cap.count -= 1
            db.session.add(cap)
            db.session.commit()
            return jsonify({"nickname": user.nickname, "number": cap.number, "count": cap.count})
        else:
            abort(400) 


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
        for c in range(1, 100):
            cap = Cap(number=c, count=0, owner=user)
            db.session.add(cap)
        db.session.commit()
    login_user(user, True)
    return redirect(url_for('index'))


@app.before_request
def before_request():
    g.user = current_user
