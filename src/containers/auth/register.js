import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { registerUser } from "../../actions/auth";
import { Link } from "react-router-dom";
import ImgQR from "../../assets/img/qrcode.png"

const SignupForm = ({ onSubmit, error }) => {
  const onFinish = values => {
    onSubmit(values);
  };

  return (
    <Form
      name="register"
      className="register-form"
      onFinish={onFinish}
    >
      <div className="qr-image mb-5">
        <img src={ImgQR} alt="qrcode" />
      </div>
      <div className="auth-title mb-4">
        <h3>Register Participant</h3>
        <Link to="/">Back to Home</Link>
      </div>
      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please input your first name!"
          }
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="First name"
        />
      </Form.Item>
      <Form.Item
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please input your last name!"
          }
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Last name"
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!"
          }
        ]}
      >
        <Input
          type="email"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!"
          }
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        name="conf_password"
        rules={[
          {
            required: true,
            message: "Please confirm your Password!"
          }
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Confirm Password"
        />
      </Form.Item>
      {error && <p className="error">{error}</p>}
      <button
        type="submit"
        className="covid-btn covid-success"
      >
        Register
      </button>
      <br />
      <Link className="mt-4" to="/login">
        Already Have an Account
      </Link>
    </Form>
  );
};

class Register extends Component {
  render() {
    return (
      <div className="auth">
        <SignupForm
          onSubmit={this.props.registerUser}
          error={this.props.errorMessage}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps, { registerUser })(Register);
