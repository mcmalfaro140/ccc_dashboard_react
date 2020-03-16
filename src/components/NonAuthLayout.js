import React, { Component, Suspense } from "react";
import { connect } from 'react-redux';

// loading
const loading = () => <div className="text-center">Loading...</div>

class NonAuthLayout extends Component {
    render() {
        const children = this.props.children || null;
        return (
            <Suspense fallback={loading()}>
                {children}
            </Suspense>
        );
    }
}

export default connect()(NonAuthLayout);